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
    console.log(suggestedTopics);

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

    const topicTitle = htmlDecode(topic.fancyTitle);
    const topicUrl = topic.url;
    const categoryColor = topic.category.color;
    const categoryName = topic.category.name;
    const categoryUrl = topic.category.url;
    const categoryStyle = topic.category.siteSettings.category_style;
    const replyCount = topic.replyCount;
    const viewCount = topic.views;
    const activity = topic.last_posted_at;
    const tags = topic.tags;
    const tagStyle = topic.siteSettings.tag_style;

    contents.push(
      h(
        'a.title.raw-topic-link.raw-link',
        {
          attributes: {
            href: topicUrl,
          },
        },
        topicTitle
      )
    );

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

    contents.push(
      h(
        `a.badge-wrapper.${categoryStyle}`,
        {
          attributes: {
            href: categoryUrl,
          },
        },
        categoryInfo
      )
    );

    contents.push(this.getTags(tags, tagStyle));
    return contents;
  },

  getTags(tags, tagStyle) {
    const allTags = [];
    if (tags) {
      tags.forEach((tag) => {
        console.log(tag);
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
