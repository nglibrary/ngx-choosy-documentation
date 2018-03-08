webpackJsonp([2],{3:function(n,e,t){n.exports=t("m7QE")},KF6U:function(n,e){n.exports=function(n){"undefined"!=typeof execScript?execScript(n):eval.call(null,n)}},f9Fm:function(n,e){n.exports="/**\n * marked - a markdown parser\n * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)\n * https://github.com/chjj/marked\n */\n\n;(function(root) {\n'use strict';\n\n/**\n * Block-Level Grammar\n */\n\nvar block = {\n  newline: /^\\n+/,\n  code: /^( {4}[^\\n]+\\n*)+/,\n  fences: noop,\n  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)/,\n  heading: /^ *(#{1,6}) *([^\\n]+?) *#* *(?:\\n+|$)/,\n  nptable: noop,\n  blockquote: /^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/,\n  list: /^( *)(bull) [\\s\\S]+?(?:hr|def|\\n{2,}(?! )(?!\\1bull )\\n*|\\s*$)/,\n  html: /^ *(?:comment *(?:\\n|\\s*$)|closed *(?:\\n{2,}|\\s*$)|closing *(?:\\n{2,}|\\s*$))/,\n  def: /^ {0,3}\\[(label)\\]: *\\n? *<?([^\\s>]+)>?(?:(?: +\\n? *| *\\n *)(title))? *(?:\\n+|$)/,\n  table: noop,\n  lheading: /^([^\\n]+)\\n *(=|-){2,} *(?:\\n+|$)/,\n  paragraph: /^([^\\n]+(?:\\n?(?!hr|heading|lheading| {0,3}>|tag)[^\\n]+)+)/,\n  text: /^[^\\n]+/\n};\n\nblock._label = /(?:\\\\[\\[\\]]|[^\\[\\]])+/;\nblock._title = /(?:\"(?:\\\\\"|[^\"]|\"[^\"\\n]*\")*\"|'\\n?(?:[^'\\n]+\\n?)*'|\\([^()]*\\))/;\nblock.def = edit(block.def)\n  .replace('label', block._label)\n  .replace('title', block._title)\n  .getRegex();\n\nblock.bullet = /(?:[*+-]|\\d+\\.)/;\nblock.item = /^( *)(bull) [^\\n]*(?:\\n(?!\\1bull )[^\\n]*)*/;\nblock.item = edit(block.item, 'gm')\n  .replace(/bull/g, block.bullet)\n  .getRegex();\n\nblock.list = edit(block.list)\n  .replace(/bull/g, block.bullet)\n  .replace('hr', '\\\\n+(?=\\\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$))')\n  .replace('def', '\\\\n+(?=' + block.def.source + ')')\n  .getRegex();\n\nblock._tag = '(?!(?:'\n  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'\n  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'\n  + '|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b';\n\nblock.html = edit(block.html)\n  .replace('comment', /\x3c!--[\\s\\S]*?--\x3e/)\n  .replace('closed', /<(tag)[\\s\\S]+?<\\/\\1>/)\n  .replace('closing', /<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"\\/>\\s]*)*?\\/?>/)\n  .replace(/tag/g, block._tag)\n  .getRegex();\n\nblock.paragraph = edit(block.paragraph)\n  .replace('hr', block.hr)\n  .replace('heading', block.heading)\n  .replace('lheading', block.lheading)\n  .replace('tag', '<' + block._tag)\n  .getRegex();\n\nblock.blockquote = edit(block.blockquote)\n  .replace('paragraph', block.paragraph)\n  .getRegex();\n\n/**\n * Normal Block Grammar\n */\n\nblock.normal = merge({}, block);\n\n/**\n * GFM Block Grammar\n */\n\nblock.gfm = merge({}, block.normal, {\n  fences: /^ *(`{3,}|~{3,})[ \\.]*(\\S+)? *\\n([\\s\\S]*?)\\n? *\\1 *(?:\\n+|$)/,\n  paragraph: /^/,\n  heading: /^ *(#{1,6}) +([^\\n]+?) *#* *(?:\\n+|$)/\n});\n\nblock.gfm.paragraph = edit(block.paragraph)\n  .replace('(?!', '(?!'\n    + block.gfm.fences.source.replace('\\\\1', '\\\\2') + '|'\n    + block.list.source.replace('\\\\1', '\\\\3') + '|')\n  .getRegex();\n\n/**\n * GFM + Tables Block Grammar\n */\n\nblock.tables = merge({}, block.gfm, {\n  nptable: /^ *(\\S.*\\|.*)\\n *([-:]+ *\\|[-| :]*)\\n((?:.*\\|.*(?:\\n|$))*)\\n*/,\n  table: /^ *\\|(.+)\\n *\\|( *[-:]+[-| :]*)\\n((?: *\\|.*(?:\\n|$))*)\\n*/\n});\n\n/**\n * Block Lexer\n */\n\nfunction Lexer(options) {\n  this.tokens = [];\n  this.tokens.links = {};\n  this.options = options || marked.defaults;\n  this.rules = block.normal;\n\n  if (this.options.gfm) {\n    if (this.options.tables) {\n      this.rules = block.tables;\n    } else {\n      this.rules = block.gfm;\n    }\n  }\n}\n\n/**\n * Expose Block Rules\n */\n\nLexer.rules = block;\n\n/**\n * Static Lex Method\n */\n\nLexer.lex = function(src, options) {\n  var lexer = new Lexer(options);\n  return lexer.lex(src);\n};\n\n/**\n * Preprocessing\n */\n\nLexer.prototype.lex = function(src) {\n  src = src\n    .replace(/\\r\\n|\\r/g, '\\n')\n    .replace(/\\t/g, '    ')\n    .replace(/\\u00a0/g, ' ')\n    .replace(/\\u2424/g, '\\n');\n\n  return this.token(src, true);\n};\n\n/**\n * Lexing\n */\n\nLexer.prototype.token = function(src, top) {\n  src = src.replace(/^ +$/gm, '');\n  var next,\n      loose,\n      cap,\n      bull,\n      b,\n      item,\n      space,\n      i,\n      tag,\n      l;\n\n  while (src) {\n    // newline\n    if (cap = this.rules.newline.exec(src)) {\n      src = src.substring(cap[0].length);\n      if (cap[0].length > 1) {\n        this.tokens.push({\n          type: 'space'\n        });\n      }\n    }\n\n    // code\n    if (cap = this.rules.code.exec(src)) {\n      src = src.substring(cap[0].length);\n      cap = cap[0].replace(/^ {4}/gm, '');\n      this.tokens.push({\n        type: 'code',\n        text: !this.options.pedantic\n          ? cap.replace(/\\n+$/, '')\n          : cap\n      });\n      continue;\n    }\n\n    // fences (gfm)\n    if (cap = this.rules.fences.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'code',\n        lang: cap[2],\n        text: cap[3] || ''\n      });\n      continue;\n    }\n\n    // heading\n    if (cap = this.rules.heading.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'heading',\n        depth: cap[1].length,\n        text: cap[2]\n      });\n      continue;\n    }\n\n    // table no leading pipe (gfm)\n    if (top && (cap = this.rules.nptable.exec(src))) {\n      src = src.substring(cap[0].length);\n\n      item = {\n        type: 'table',\n        header: cap[1].replace(/^ *| *\\| *$/g, '').split(/ *\\| */),\n        align: cap[2].replace(/^ *|\\| *$/g, '').split(/ *\\| */),\n        cells: cap[3].replace(/\\n$/, '').split('\\n')\n      };\n\n      for (i = 0; i < item.align.length; i++) {\n        if (/^ *-+: *$/.test(item.align[i])) {\n          item.align[i] = 'right';\n        } else if (/^ *:-+: *$/.test(item.align[i])) {\n          item.align[i] = 'center';\n        } else if (/^ *:-+ *$/.test(item.align[i])) {\n          item.align[i] = 'left';\n        } else {\n          item.align[i] = null;\n        }\n      }\n\n      for (i = 0; i < item.cells.length; i++) {\n        item.cells[i] = item.cells[i].split(/ *\\| */);\n      }\n\n      this.tokens.push(item);\n\n      continue;\n    }\n\n    // hr\n    if (cap = this.rules.hr.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'hr'\n      });\n      continue;\n    }\n\n    // blockquote\n    if (cap = this.rules.blockquote.exec(src)) {\n      src = src.substring(cap[0].length);\n\n      this.tokens.push({\n        type: 'blockquote_start'\n      });\n\n      cap = cap[0].replace(/^ *> ?/gm, '');\n\n      // Pass `top` to keep the current\n      // \"toplevel\" state. This is exactly\n      // how markdown.pl works.\n      this.token(cap, top);\n\n      this.tokens.push({\n        type: 'blockquote_end'\n      });\n\n      continue;\n    }\n\n    // list\n    if (cap = this.rules.list.exec(src)) {\n      src = src.substring(cap[0].length);\n      bull = cap[2];\n\n      this.tokens.push({\n        type: 'list_start',\n        ordered: bull.length > 1\n      });\n\n      // Get each top-level item.\n      cap = cap[0].match(this.rules.item);\n\n      next = false;\n      l = cap.length;\n      i = 0;\n\n      for (; i < l; i++) {\n        item = cap[i];\n\n        // Remove the list item's bullet\n        // so it is seen as the next token.\n        space = item.length;\n        item = item.replace(/^ *([*+-]|\\d+\\.) +/, '');\n\n        // Outdent whatever the\n        // list item contains. Hacky.\n        if (~item.indexOf('\\n ')) {\n          space -= item.length;\n          item = !this.options.pedantic\n            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')\n            : item.replace(/^ {1,4}/gm, '');\n        }\n\n        // Determine whether the next list item belongs here.\n        // Backpedal if it does not belong in this list.\n        if (this.options.smartLists && i !== l - 1) {\n          b = block.bullet.exec(cap[i + 1])[0];\n          if (bull !== b && !(bull.length > 1 && b.length > 1)) {\n            src = cap.slice(i + 1).join('\\n') + src;\n            i = l - 1;\n          }\n        }\n\n        // Determine whether item is loose or not.\n        // Use: /(^|\\n)(?! )[^\\n]+\\n\\n(?!\\s*$)/\n        // for discount behavior.\n        loose = next || /\\n\\n(?!\\s*$)/.test(item);\n        if (i !== l - 1) {\n          next = item.charAt(item.length - 1) === '\\n';\n          if (!loose) loose = next;\n        }\n\n        this.tokens.push({\n          type: loose\n            ? 'loose_item_start'\n            : 'list_item_start'\n        });\n\n        // Recurse.\n        this.token(item, false);\n\n        this.tokens.push({\n          type: 'list_item_end'\n        });\n      }\n\n      this.tokens.push({\n        type: 'list_end'\n      });\n\n      continue;\n    }\n\n    // html\n    if (cap = this.rules.html.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: this.options.sanitize\n          ? 'paragraph'\n          : 'html',\n        pre: !this.options.sanitizer\n          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),\n        text: cap[0]\n      });\n      continue;\n    }\n\n    // def\n    if (top && (cap = this.rules.def.exec(src))) {\n      src = src.substring(cap[0].length);\n      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);\n      tag = cap[1].toLowerCase();\n      if (!this.tokens.links[tag]) {\n        this.tokens.links[tag] = {\n          href: cap[2],\n          title: cap[3]\n        };\n      }\n      continue;\n    }\n\n    // table (gfm)\n    if (top && (cap = this.rules.table.exec(src))) {\n      src = src.substring(cap[0].length);\n\n      item = {\n        type: 'table',\n        header: cap[1].replace(/^ *| *\\| *$/g, '').split(/ *\\| */),\n        align: cap[2].replace(/^ *|\\| *$/g, '').split(/ *\\| */),\n        cells: cap[3].replace(/(?: *\\| *)?\\n$/, '').split('\\n')\n      };\n\n      for (i = 0; i < item.align.length; i++) {\n        if (/^ *-+: *$/.test(item.align[i])) {\n          item.align[i] = 'right';\n        } else if (/^ *:-+: *$/.test(item.align[i])) {\n          item.align[i] = 'center';\n        } else if (/^ *:-+ *$/.test(item.align[i])) {\n          item.align[i] = 'left';\n        } else {\n          item.align[i] = null;\n        }\n      }\n\n      for (i = 0; i < item.cells.length; i++) {\n        item.cells[i] = item.cells[i]\n          .replace(/^ *\\| *| *\\| *$/g, '')\n          .split(/ *\\| */);\n      }\n\n      this.tokens.push(item);\n\n      continue;\n    }\n\n    // lheading\n    if (cap = this.rules.lheading.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'heading',\n        depth: cap[2] === '=' ? 1 : 2,\n        text: cap[1]\n      });\n      continue;\n    }\n\n    // top-level paragraph\n    if (top && (cap = this.rules.paragraph.exec(src))) {\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'paragraph',\n        text: cap[1].charAt(cap[1].length - 1) === '\\n'\n          ? cap[1].slice(0, -1)\n          : cap[1]\n      });\n      continue;\n    }\n\n    // text\n    if (cap = this.rules.text.exec(src)) {\n      // Top-level should never reach here.\n      src = src.substring(cap[0].length);\n      this.tokens.push({\n        type: 'text',\n        text: cap[0]\n      });\n      continue;\n    }\n\n    if (src) {\n      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));\n    }\n  }\n\n  return this.tokens;\n};\n\n/**\n * Inline-Level Grammar\n */\n\nvar inline = {\n  escape: /^\\\\([\\\\`*{}\\[\\]()#+\\-.!_>])/,\n  autolink: /^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/,\n  url: noop,\n  tag: /^\x3c!--[\\s\\S]*?--\x3e|^<\\/?[a-zA-Z0-9\\-]+(?:\"[^\"]*\"|'[^']*'|\\s[^<'\">\\/\\s]*)*?\\/?>/,\n  link: /^!?\\[(inside)\\]\\(href\\)/,\n  reflink: /^!?\\[(inside)\\]\\s*\\[([^\\]]*)\\]/,\n  nolink: /^!?\\[((?:\\[[^\\[\\]]*\\]|\\\\[\\[\\]]|[^\\[\\]])*)\\]/,\n  strong: /^__([\\s\\S]+?)__(?!_)|^\\*\\*([\\s\\S]+?)\\*\\*(?!\\*)/,\n  em: /^_([^\\s_](?:[^_]|__)+?[^\\s_])_\\b|^\\*((?:\\*\\*|[^*])+?)\\*(?!\\*)/,\n  code: /^(`+)\\s*([\\s\\S]*?[^`]?)\\s*\\1(?!`)/,\n  br: /^ {2,}\\n(?!\\s*$)/,\n  del: noop,\n  text: /^[\\s\\S]+?(?=[\\\\<!\\[`*]|\\b_| {2,}\\n|$)/\n};\n\ninline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;\ninline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;\n\ninline.autolink = edit(inline.autolink)\n  .replace('scheme', inline._scheme)\n  .replace('email', inline._email)\n  .getRegex()\n\ninline._inside = /(?:\\[[^\\[\\]]*\\]|\\\\[\\[\\]]|[^\\[\\]]|\\](?=[^\\[]*\\]))*/;\ninline._href = /\\s*<?([\\s\\S]*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*/;\n\ninline.link = edit(inline.link)\n  .replace('inside', inline._inside)\n  .replace('href', inline._href)\n  .getRegex();\n\ninline.reflink = edit(inline.reflink)\n  .replace('inside', inline._inside)\n  .getRegex();\n\n/**\n * Normal Inline Grammar\n */\n\ninline.normal = merge({}, inline);\n\n/**\n * Pedantic Inline Grammar\n */\n\ninline.pedantic = merge({}, inline.normal, {\n  strong: /^__(?=\\S)([\\s\\S]*?\\S)__(?!_)|^\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*(?!\\*)/,\n  em: /^_(?=\\S)([\\s\\S]*?\\S)_(?!_)|^\\*(?=\\S)([\\s\\S]*?\\S)\\*(?!\\*)/\n});\n\n/**\n * GFM Inline Grammar\n */\n\ninline.gfm = merge({}, inline.normal, {\n  escape: edit(inline.escape).replace('])', '~|])').getRegex(),\n  url: edit(/^((?:ftp|https?):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/)\n    .replace('email', inline._email)\n    .getRegex(),\n  _backpedal: /(?:[^?!.,:;*_~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,\n  del: /^~~(?=\\S)([\\s\\S]*?\\S)~~/,\n  text: edit(inline.text)\n    .replace(']|', '~]|')\n    .replace('|', '|https?://|ftp://|www\\\\.|[a-zA-Z0-9.!#$%&\\'*+/=?^_`{\\\\|}~-]+@|')\n    .getRegex()\n});\n\n/**\n * GFM + Line Breaks Inline Grammar\n */\n\ninline.breaks = merge({}, inline.gfm, {\n  br: edit(inline.br).replace('{2,}', '*').getRegex(),\n  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()\n});\n\n/**\n * Inline Lexer & Compiler\n */\n\nfunction InlineLexer(links, options) {\n  this.options = options || marked.defaults;\n  this.links = links;\n  this.rules = inline.normal;\n  this.renderer = this.options.renderer || new Renderer();\n  this.renderer.options = this.options;\n\n  if (!this.links) {\n    throw new Error('Tokens array requires a `links` property.');\n  }\n\n  if (this.options.gfm) {\n    if (this.options.breaks) {\n      this.rules = inline.breaks;\n    } else {\n      this.rules = inline.gfm;\n    }\n  } else if (this.options.pedantic) {\n    this.rules = inline.pedantic;\n  }\n}\n\n/**\n * Expose Inline Rules\n */\n\nInlineLexer.rules = inline;\n\n/**\n * Static Lexing/Compiling Method\n */\n\nInlineLexer.output = function(src, links, options) {\n  var inline = new InlineLexer(links, options);\n  return inline.output(src);\n};\n\n/**\n * Lexing/Compiling\n */\n\nInlineLexer.prototype.output = function(src) {\n  var out = '',\n      link,\n      text,\n      href,\n      cap;\n\n  while (src) {\n    // escape\n    if (cap = this.rules.escape.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += cap[1];\n      continue;\n    }\n\n    // autolink\n    if (cap = this.rules.autolink.exec(src)) {\n      src = src.substring(cap[0].length);\n      if (cap[2] === '@') {\n        text = escape(this.mangle(cap[1]));\n        href = 'mailto:' + text;\n      } else {\n        text = escape(cap[1]);\n        href = text;\n      }\n      out += this.renderer.link(href, null, text);\n      continue;\n    }\n\n    // url (gfm)\n    if (!this.inLink && (cap = this.rules.url.exec(src))) {\n      cap[0] = this.rules._backpedal.exec(cap[0])[0];\n      src = src.substring(cap[0].length);\n      if (cap[2] === '@') {\n        text = escape(cap[0]);\n        href = 'mailto:' + text;\n      } else {\n        text = escape(cap[0]);\n        if (cap[1] === 'www.') {\n          href = 'http://' + text;\n        } else {\n          href = text;\n        }\n      }\n      out += this.renderer.link(href, null, text);\n      continue;\n    }\n\n    // tag\n    if (cap = this.rules.tag.exec(src)) {\n      if (!this.inLink && /^<a /i.test(cap[0])) {\n        this.inLink = true;\n      } else if (this.inLink && /^<\\/a>/i.test(cap[0])) {\n        this.inLink = false;\n      }\n      src = src.substring(cap[0].length);\n      out += this.options.sanitize\n        ? this.options.sanitizer\n          ? this.options.sanitizer(cap[0])\n          : escape(cap[0])\n        : cap[0]\n      continue;\n    }\n\n    // link\n    if (cap = this.rules.link.exec(src)) {\n      src = src.substring(cap[0].length);\n      this.inLink = true;\n      out += this.outputLink(cap, {\n        href: cap[2],\n        title: cap[3]\n      });\n      this.inLink = false;\n      continue;\n    }\n\n    // reflink, nolink\n    if ((cap = this.rules.reflink.exec(src))\n        || (cap = this.rules.nolink.exec(src))) {\n      src = src.substring(cap[0].length);\n      link = (cap[2] || cap[1]).replace(/\\s+/g, ' ');\n      link = this.links[link.toLowerCase()];\n      if (!link || !link.href) {\n        out += cap[0].charAt(0);\n        src = cap[0].substring(1) + src;\n        continue;\n      }\n      this.inLink = true;\n      out += this.outputLink(cap, link);\n      this.inLink = false;\n      continue;\n    }\n\n    // strong\n    if (cap = this.rules.strong.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.strong(this.output(cap[2] || cap[1]));\n      continue;\n    }\n\n    // em\n    if (cap = this.rules.em.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.em(this.output(cap[2] || cap[1]));\n      continue;\n    }\n\n    // code\n    if (cap = this.rules.code.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.codespan(escape(cap[2].trim(), true));\n      continue;\n    }\n\n    // br\n    if (cap = this.rules.br.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.br();\n      continue;\n    }\n\n    // del (gfm)\n    if (cap = this.rules.del.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.del(this.output(cap[1]));\n      continue;\n    }\n\n    // text\n    if (cap = this.rules.text.exec(src)) {\n      src = src.substring(cap[0].length);\n      out += this.renderer.text(escape(this.smartypants(cap[0])));\n      continue;\n    }\n\n    if (src) {\n      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));\n    }\n  }\n\n  return out;\n};\n\n/**\n * Compile Link\n */\n\nInlineLexer.prototype.outputLink = function(cap, link) {\n  var href = escape(link.href),\n      title = link.title ? escape(link.title) : null;\n\n  return cap[0].charAt(0) !== '!'\n    ? this.renderer.link(href, title, this.output(cap[1]))\n    : this.renderer.image(href, title, escape(cap[1]));\n};\n\n/**\n * Smartypants Transformations\n */\n\nInlineLexer.prototype.smartypants = function(text) {\n  if (!this.options.smartypants) return text;\n  return text\n    // em-dashes\n    .replace(/---/g, '\\u2014')\n    // en-dashes\n    .replace(/--/g, '\\u2013')\n    // opening singles\n    .replace(/(^|[-\\u2014/(\\[{\"\\s])'/g, '$1\\u2018')\n    // closing singles & apostrophes\n    .replace(/'/g, '\\u2019')\n    // opening doubles\n    .replace(/(^|[-\\u2014/(\\[{\\u2018\\s])\"/g, '$1\\u201c')\n    // closing doubles\n    .replace(/\"/g, '\\u201d')\n    // ellipses\n    .replace(/\\.{3}/g, '\\u2026');\n};\n\n/**\n * Mangle Links\n */\n\nInlineLexer.prototype.mangle = function(text) {\n  if (!this.options.mangle) return text;\n  var out = '',\n      l = text.length,\n      i = 0,\n      ch;\n\n  for (; i < l; i++) {\n    ch = text.charCodeAt(i);\n    if (Math.random() > 0.5) {\n      ch = 'x' + ch.toString(16);\n    }\n    out += '&#' + ch + ';';\n  }\n\n  return out;\n};\n\n/**\n * Renderer\n */\n\nfunction Renderer(options) {\n  this.options = options || {};\n}\n\nRenderer.prototype.code = function(code, lang, escaped) {\n  if (this.options.highlight) {\n    var out = this.options.highlight(code, lang);\n    if (out != null && out !== code) {\n      escaped = true;\n      code = out;\n    }\n  }\n\n  if (!lang) {\n    return '<pre><code>'\n      + (escaped ? code : escape(code, true))\n      + '\\n</code></pre>';\n  }\n\n  return '<pre><code class=\"'\n    + this.options.langPrefix\n    + escape(lang, true)\n    + '\">'\n    + (escaped ? code : escape(code, true))\n    + '\\n</code></pre>\\n';\n};\n\nRenderer.prototype.blockquote = function(quote) {\n  return '<blockquote>\\n' + quote + '</blockquote>\\n';\n};\n\nRenderer.prototype.html = function(html) {\n  return html;\n};\n\nRenderer.prototype.heading = function(text, level, raw) {\n  return '<h'\n    + level\n    + ' id=\"'\n    + this.options.headerPrefix\n    + raw.toLowerCase().replace(/[^\\w]+/g, '-')\n    + '\">'\n    + text\n    + '</h'\n    + level\n    + '>\\n';\n};\n\nRenderer.prototype.hr = function() {\n  return this.options.xhtml ? '<hr/>\\n' : '<hr>\\n';\n};\n\nRenderer.prototype.list = function(body, ordered) {\n  var type = ordered ? 'ol' : 'ul';\n  return '<' + type + '>\\n' + body + '</' + type + '>\\n';\n};\n\nRenderer.prototype.listitem = function(text) {\n  return '<li>' + text + '</li>\\n';\n};\n\nRenderer.prototype.paragraph = function(text) {\n  return '<p>' + text + '</p>\\n';\n};\n\nRenderer.prototype.table = function(header, body) {\n  return '<table>\\n'\n    + '<thead>\\n'\n    + header\n    + '</thead>\\n'\n    + '<tbody>\\n'\n    + body\n    + '</tbody>\\n'\n    + '</table>\\n';\n};\n\nRenderer.prototype.tablerow = function(content) {\n  return '<tr>\\n' + content + '</tr>\\n';\n};\n\nRenderer.prototype.tablecell = function(content, flags) {\n  var type = flags.header ? 'th' : 'td';\n  var tag = flags.align\n    ? '<' + type + ' style=\"text-align:' + flags.align + '\">'\n    : '<' + type + '>';\n  return tag + content + '</' + type + '>\\n';\n};\n\n// span level renderer\nRenderer.prototype.strong = function(text) {\n  return '<strong>' + text + '</strong>';\n};\n\nRenderer.prototype.em = function(text) {\n  return '<em>' + text + '</em>';\n};\n\nRenderer.prototype.codespan = function(text) {\n  return '<code>' + text + '</code>';\n};\n\nRenderer.prototype.br = function() {\n  return this.options.xhtml ? '<br/>' : '<br>';\n};\n\nRenderer.prototype.del = function(text) {\n  return '<del>' + text + '</del>';\n};\n\nRenderer.prototype.link = function(href, title, text) {\n  if (this.options.sanitize) {\n    try {\n      var prot = decodeURIComponent(unescape(href))\n        .replace(/[^\\w:]/g, '')\n        .toLowerCase();\n    } catch (e) {\n      return text;\n    }\n    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {\n      return text;\n    }\n  }\n  if (this.options.baseUrl && !originIndependentUrl.test(href)) {\n    href = resolveUrl(this.options.baseUrl, href);\n  }\n  var out = '<a href=\"' + href + '\"';\n  if (title) {\n    out += ' title=\"' + title + '\"';\n  }\n  out += '>' + text + '</a>';\n  return out;\n};\n\nRenderer.prototype.image = function(href, title, text) {\n  if (this.options.baseUrl && !originIndependentUrl.test(href)) {\n    href = resolveUrl(this.options.baseUrl, href);\n  }\n  var out = '<img src=\"' + href + '\" alt=\"' + text + '\"';\n  if (title) {\n    out += ' title=\"' + title + '\"';\n  }\n  out += this.options.xhtml ? '/>' : '>';\n  return out;\n};\n\nRenderer.prototype.text = function(text) {\n  return text;\n};\n\n/**\n * TextRenderer\n * returns only the textual part of the token\n */\n\nfunction TextRenderer() {}\n\n// no need for block level renderers\n\nTextRenderer.prototype.strong =\nTextRenderer.prototype.em =\nTextRenderer.prototype.codespan =\nTextRenderer.prototype.del =\nTextRenderer.prototype.text = function (text) {\n  return text;\n}\n\nTextRenderer.prototype.link =\nTextRenderer.prototype.image = function(href, title, text) {\n  return '' + text;\n}\n\nTextRenderer.prototype.br = function() {\n  return '';\n}\n\n/**\n * Parsing & Compiling\n */\n\nfunction Parser(options) {\n  this.tokens = [];\n  this.token = null;\n  this.options = options || marked.defaults;\n  this.options.renderer = this.options.renderer || new Renderer();\n  this.renderer = this.options.renderer;\n  this.renderer.options = this.options;\n}\n\n/**\n * Static Parse Method\n */\n\nParser.parse = function(src, options) {\n  var parser = new Parser(options);\n  return parser.parse(src);\n};\n\n/**\n * Parse Loop\n */\n\nParser.prototype.parse = function(src) {\n  this.inline = new InlineLexer(src.links, this.options);\n  // use an InlineLexer with a TextRenderer to extract pure text\n  this.inlineText = new InlineLexer(\n    src.links,\n    merge({}, this.options, {renderer: new TextRenderer()})\n  );\n  this.tokens = src.reverse();\n\n  var out = '';\n  while (this.next()) {\n    out += this.tok();\n  }\n\n  return out;\n};\n\n/**\n * Next Token\n */\n\nParser.prototype.next = function() {\n  return this.token = this.tokens.pop();\n};\n\n/**\n * Preview Next Token\n */\n\nParser.prototype.peek = function() {\n  return this.tokens[this.tokens.length - 1] || 0;\n};\n\n/**\n * Parse Text Tokens\n */\n\nParser.prototype.parseText = function() {\n  var body = this.token.text;\n\n  while (this.peek().type === 'text') {\n    body += '\\n' + this.next().text;\n  }\n\n  return this.inline.output(body);\n};\n\n/**\n * Parse Current Token\n */\n\nParser.prototype.tok = function() {\n  switch (this.token.type) {\n    case 'space': {\n      return '';\n    }\n    case 'hr': {\n      return this.renderer.hr();\n    }\n    case 'heading': {\n      return this.renderer.heading(\n        this.inline.output(this.token.text),\n        this.token.depth,\n        unescape(this.inlineText.output(this.token.text)));\n    }\n    case 'code': {\n      return this.renderer.code(this.token.text,\n        this.token.lang,\n        this.token.escaped);\n    }\n    case 'table': {\n      var header = '',\n          body = '',\n          i,\n          row,\n          cell,\n          j;\n\n      // header\n      cell = '';\n      for (i = 0; i < this.token.header.length; i++) {\n        cell += this.renderer.tablecell(\n          this.inline.output(this.token.header[i]),\n          { header: true, align: this.token.align[i] }\n        );\n      }\n      header += this.renderer.tablerow(cell);\n\n      for (i = 0; i < this.token.cells.length; i++) {\n        row = this.token.cells[i];\n\n        cell = '';\n        for (j = 0; j < row.length; j++) {\n          cell += this.renderer.tablecell(\n            this.inline.output(row[j]),\n            { header: false, align: this.token.align[j] }\n          );\n        }\n\n        body += this.renderer.tablerow(cell);\n      }\n      return this.renderer.table(header, body);\n    }\n    case 'blockquote_start': {\n      body = '';\n\n      while (this.next().type !== 'blockquote_end') {\n        body += this.tok();\n      }\n\n      return this.renderer.blockquote(body);\n    }\n    case 'list_start': {\n      body = '';\n      var ordered = this.token.ordered;\n\n      while (this.next().type !== 'list_end') {\n        body += this.tok();\n      }\n\n      return this.renderer.list(body, ordered);\n    }\n    case 'list_item_start': {\n      body = '';\n\n      while (this.next().type !== 'list_item_end') {\n        body += this.token.type === 'text'\n          ? this.parseText()\n          : this.tok();\n      }\n\n      return this.renderer.listitem(body);\n    }\n    case 'loose_item_start': {\n      body = '';\n\n      while (this.next().type !== 'list_item_end') {\n        body += this.tok();\n      }\n\n      return this.renderer.listitem(body);\n    }\n    case 'html': {\n      var html = !this.token.pre && !this.options.pedantic\n        ? this.inline.output(this.token.text)\n        : this.token.text;\n      return this.renderer.html(html);\n    }\n    case 'paragraph': {\n      return this.renderer.paragraph(this.inline.output(this.token.text));\n    }\n    case 'text': {\n      return this.renderer.paragraph(this.parseText());\n    }\n  }\n};\n\n/**\n * Helpers\n */\n\nfunction escape(html, encode) {\n  return html\n    .replace(!encode ? /&(?!#?\\w+;)/g : /&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\"/g, '&quot;')\n    .replace(/'/g, '&#39;');\n}\n\nfunction unescape(html) {\n  // explicitly match decimal, hex, and named HTML entities\n  return html.replace(/&(#(?:\\d+)|(?:#x[0-9A-Fa-f]+)|(?:\\w+));?/ig, function(_, n) {\n    n = n.toLowerCase();\n    if (n === 'colon') return ':';\n    if (n.charAt(0) === '#') {\n      return n.charAt(1) === 'x'\n        ? String.fromCharCode(parseInt(n.substring(2), 16))\n        : String.fromCharCode(+n.substring(1));\n    }\n    return '';\n  });\n}\n\nfunction edit(regex, opt) {\n  regex = regex.source;\n  opt = opt || '';\n  return {\n    replace: function(name, val) {\n      val = val.source || val;\n      val = val.replace(/(^|[^\\[])\\^/g, '$1');\n      regex = regex.replace(name, val);\n      return this;\n    },\n    getRegex: function() {\n      return new RegExp(regex, opt);\n    }\n  };\n}\n\nfunction resolveUrl(base, href) {\n  if (!baseUrls[' ' + base]) {\n    // we can ignore everything in base after the last slash of its path component,\n    // but we might need to add _that_\n    // https://tools.ietf.org/html/rfc3986#section-3\n    if (/^[^:]+:\\/*[^/]*$/.test(base)) {\n      baseUrls[' ' + base] = base + '/';\n    } else {\n      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');\n    }\n  }\n  base = baseUrls[' ' + base];\n\n  if (href.slice(0, 2) === '//') {\n    return base.replace(/:[\\s\\S]*/, ':') + href;\n  } else if (href.charAt(0) === '/') {\n    return base.replace(/(:\\/*[^/]*)[\\s\\S]*/, '$1') + href;\n  } else {\n    return base + href;\n  }\n}\nvar baseUrls = {};\nvar originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;\n\nfunction noop() {}\nnoop.exec = noop;\n\nfunction merge(obj) {\n  var i = 1,\n      target,\n      key;\n\n  for (; i < arguments.length; i++) {\n    target = arguments[i];\n    for (key in target) {\n      if (Object.prototype.hasOwnProperty.call(target, key)) {\n        obj[key] = target[key];\n      }\n    }\n  }\n\n  return obj;\n}\n\n/**\n * Marked\n */\n\nfunction marked(src, opt, callback) {\n  // throw error in case of non string input\n  if (typeof src === 'undefined' || src === null) {\n    throw new Error('marked(): input parameter is undefined or null');\n  }\n  if (typeof src !== 'string') {\n    throw new Error('marked(): input parameter is of type '\n      + Object.prototype.toString.call(src) + ', string expected');\n  }\n\n  if (callback || typeof opt === 'function') {\n    if (!callback) {\n      callback = opt;\n      opt = null;\n    }\n\n    opt = merge({}, marked.defaults, opt || {});\n\n    var highlight = opt.highlight,\n        tokens,\n        pending,\n        i = 0;\n\n    try {\n      tokens = Lexer.lex(src, opt)\n    } catch (e) {\n      return callback(e);\n    }\n\n    pending = tokens.length;\n\n    var done = function(err) {\n      if (err) {\n        opt.highlight = highlight;\n        return callback(err);\n      }\n\n      var out;\n\n      try {\n        out = Parser.parse(tokens, opt);\n      } catch (e) {\n        err = e;\n      }\n\n      opt.highlight = highlight;\n\n      return err\n        ? callback(err)\n        : callback(null, out);\n    };\n\n    if (!highlight || highlight.length < 3) {\n      return done();\n    }\n\n    delete opt.highlight;\n\n    if (!pending) return done();\n\n    for (; i < tokens.length; i++) {\n      (function(token) {\n        if (token.type !== 'code') {\n          return --pending || done();\n        }\n        return highlight(token.text, token.lang, function(err, code) {\n          if (err) return done(err);\n          if (code == null || code === token.text) {\n            return --pending || done();\n          }\n          token.text = code;\n          token.escaped = true;\n          --pending || done();\n        });\n      })(tokens[i]);\n    }\n\n    return;\n  }\n  try {\n    if (opt) opt = merge({}, marked.defaults, opt);\n    return Parser.parse(Lexer.lex(src, opt), opt);\n  } catch (e) {\n    e.message += '\\nPlease report this to https://github.com/chjj/marked.';\n    if ((opt || marked.defaults).silent) {\n      return '<p>An error occurred:</p><pre>'\n        + escape(e.message + '', true)\n        + '</pre>';\n    }\n    throw e;\n  }\n}\n\n/**\n * Options\n */\n\nmarked.options =\nmarked.setOptions = function(opt) {\n  merge(marked.defaults, opt);\n  return marked;\n};\n\nmarked.defaults = {\n  gfm: true,\n  tables: true,\n  breaks: false,\n  pedantic: false,\n  sanitize: false,\n  sanitizer: null,\n  mangle: true,\n  smartLists: false,\n  silent: false,\n  highlight: null,\n  langPrefix: 'lang-',\n  smartypants: false,\n  headerPrefix: '',\n  renderer: new Renderer(),\n  xhtml: false,\n  baseUrl: null\n};\n\n/**\n * Expose\n */\n\nmarked.Parser = Parser;\nmarked.parser = Parser.parse;\n\nmarked.Renderer = Renderer;\nmarked.TextRenderer = TextRenderer;\n\nmarked.Lexer = Lexer;\nmarked.lexer = Lexer.lex;\n\nmarked.InlineLexer = InlineLexer;\nmarked.inlineLexer = InlineLexer.output;\n\nmarked.parse = marked;\n\nif (typeof module !== 'undefined' && typeof exports === 'object') {\n  module.exports = marked;\n} else if (typeof define === 'function' && define.amd) {\n  define(function() { return marked; });\n} else {\n  root.marked = marked;\n}\n})(this || (typeof window !== 'undefined' ? window : global));\n"},m7QE:function(n,e,t){t("KF6U")(t("f9Fm"))}},[3]);