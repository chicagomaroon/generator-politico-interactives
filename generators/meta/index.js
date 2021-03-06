const Generator = require('yeoman-generator');
const S = require('slugify');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('title', {
      type: String,
      required: true,
      desc: 'Project title',
    });
  }

  writing() {
    this.title = this.options.title;
    this.slug = S(this.title);

    const timestamp = new Date();
    const publishPath = `article/${timestamp.getFullYear()}/${this.slug}/`;
    const prodUrl = `https://projects.chicagomaroon.com/${publishPath}`;
    const stagingUrl = `http://stage-projects.chicagomaroon.com/${publishPath}`;

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('./.gitignore'));

    this.fs.copy(
      this.templatePath('LICENSE'),
      this.destinationPath('LICENSE'));

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        slug: this.slug,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
      });

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'), {
        slug: this.slug,
        title: this.title,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
        url: prodUrl,
        urlStaging: stagingUrl,
        year: timestamp.getFullYear(),
      });

    const metaJSON = {
      id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
      publishPath,
      stagingUrl,
      url: prodUrl,
      timestamp: '1996-09-06T08:13-0400',
      dateline: 'September 6, 1996',
      header: {
        headline: 'This is your headline in the metadata file',
        subhead: 'Subhead entices the reader.',
        bylines: [{
          name: 'Carl Maroon',
          link: 'https://www.chicagomaroon.com',
        }],
      },
      share: {
        fbook: {
          card_title: this.title,
          card_description: 'The independent student newspaper of The University of Chicago since 1892.',
        },
        twitter: {
          card_title: this.title,
          share_tweet: 'The independent student newspaper of The University of Chicago since 1892.',
          card_description: 'The independent student newspaper of The University of Chicago since 1892.',
          author: '@chicagomaroon',
        },
        image: {
          url: `${prodUrl}images/share.jpg`,
          alt: '<Text>',
          type: 'image/jpeg',
          width: '600',
          height: '300',
        },
        keywords: 'Maroon, Chicago, UChicago',
      },
    };

    this.fs.writeJSON('meta.json', metaJSON);
  }

};