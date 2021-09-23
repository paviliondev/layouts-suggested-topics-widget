export default {
  name: 'layouts-suggested-topics',

  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    const topic = container.lookup('controller:topic');

    let layouts;
    let layoutsError;

    try {
      layouts = requirejs(
        'discourse/plugins/discourse-layouts/discourse/lib/layouts'
      );
    } catch (error) {
      layoutsError = error;
      console.warn(layoutsError);
    }

    const props = {
      topic,
    };

    layouts.addSidebarProps(props);
  },
};
