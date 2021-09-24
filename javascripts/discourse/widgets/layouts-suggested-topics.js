import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

let layouts;

try {
  layouts = requirejs(
    'discourse/plugins/discourse-layouts/discourse/lib/layouts'
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  console.warn(error);
}

function htmlDecode(input) {
  let doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

export default layouts.createLayoutsWidget('suggested-topics-list', {
  html(attrs) {
    const { topic } = attrs;
    const suggestedTopics = topic.model.suggestedTopics;

    if (!suggestedTopics) return '';

    const list = [];
    suggestedTopics.forEach((topic) => {
      list.push(
        this.attach('layouts-suggested-topic', {
          topic,
        })
      );
    });

    return [
      h('h3.suggested-topics-title', 'Suggested Topics'),
      h('ul.suggested-topics', list),
    ];
  },
});

createWidget('layouts-suggested-topic', {
  tagName: 'li.topic-list-item',
  buildKey: (attrs) => `layouts-suggested-topic-${attrs.topic.id}`,

  html(attrs, state) {
    const { topic } = attrs;
    const contents = [];

    const replyCount = topic.replyCount;
    const viewCount = topic.views;
    const activity = topic.last_posted_at;

    contents.push(this.getTopicTitle(topic));
    contents.push(this.getCategories(topic.category));
    contents.push(this.getTags(topic.tags, topic.siteSettings.tag_style));
    return contents;
  },

  getTopicTitle(topic) {
    const topicTitle = htmlDecode(topic.fancyTitle);
    const topicUrl = topic.url;

    return h(
      'a.title.raw-topic-link.raw-link',
      {
        attributes: {
          href: topicUrl,
        },
      },
      topicTitle
    );
  },

  getCategories(category) {
    const categoryColor = category.color;
    const categoryName = category.name;
    const categoryUrl = category.url;
    const categoryStyle = category.siteSettings.category_style;

    const categoryInfo = [
      h(
        'span.badge-category-bg',
        {
          attributes: {
            style: `background-color: #${categoryColor}`,
          },
        },
        ''
      ),
      h('span.badge-category', h('span.category-name', categoryName)),
    ];

    return h(
      `a.badge-wrapper.${categoryStyle}`,
      {
        attributes: {
          href: categoryUrl,
        },
      },
      categoryInfo
    );
  },

  getTags(tags, tagStyle) {
    const allTags = [];
    if (tags) {
      tags.forEach((tag) => {
        allTags.push(
          h(
            `a.discourse-tag.${tagStyle}`,
            {
              attributes: {
                href: `/tag/${tag}`,
              },
            },
            tag
          )
        );
      });
    }
    return h('div.discourse-tags', allTags);
  },
});
