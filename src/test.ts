import { parse, TextNode } from 'node-html-parser';
import Html from 'slate-html-serializer';

// edit from https://github.com/ianstormtaylor/slate/blob/v0.47/examples/paste-html/index.js
const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
};

const RULES = [
  {
    deserialize(el: HTMLElement, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];

      if (block) {
        return {
          object: 'block',
          type: block,
          nodes: next(el.childNodes),
        };
      }
    },
  },
  {
    deserialize(el: HTMLElement, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()];

      if (mark) {
        return {
          object: 'mark',
          type: mark,
          nodes: next(el.childNodes),
        };
      }
    },
  },
  {
    deserialize(el: HTMLElement, next) {
      if (el.tagName.toLowerCase() === 'pre') {
        const code = el.childNodes[0];
        const childNodes =
          // @ts-ignore
          code && code.tagName.toLowerCase() === 'code'
            ? code.childNodes
            : el.childNodes;

        return {
          object: 'block',
          type: 'code',
          nodes: next(childNodes),
        };
      }
    },
  },
  {
    deserialize(el: HTMLElement, next) {
      if (el.tagName.toLowerCase() === 'img') {
        return {
          object: 'block',
          type: 'image',
          nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src'),
          },
        };
      }
    },
  },
  {
    deserialize(el: HTMLElement, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          object: 'inline',
          type: 'link',
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href'),
          },
        };
      }
    },
  },
  {
    deserialize(el: HTMLElement, next) {
      if (el instanceof TextNode) {
        return {
          object: 'block',
          type: 'text',
          data: {
            text: el.innerText,
          },
        };
      }
    },
  },
];

const slateHtmlSerializer = new Html({
  rules: RULES,
  parseHtml: parse as unknown as (html: string) => HTMLElement,
});

const y = slateHtmlSerializer.deserialize(
  `<ul id="list"><li>Hello World</li></ul><ul id="list2"><li>Hello2 World <a href="https://google.com">some link</a></li></ul>`
);
console.log(JSON.stringify(y.toJSON(), null, 2));
