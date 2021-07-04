`html: {
    lang(en)
    head: {
        meta: {
            http-equiv(Content-Type)
            content({{meta.charset}})
        }
        title: {
            [{{meta.title}}]
        }
        meta: {
            name(description)
            content({{meta.description}})
        }
        meta: {
            name(viewport)
            content({{meta.viewport}})
        }
        meta: {
            name(theme-color)
            content({{meta.themeColor}})
        }
        link: {
            rel(stylesheet)
            href(./stylesheets/global.css)
        }
    }
    body: {
        header: {
            h1: {
                class(pad1)
                [{{{main.heading}}}]
            }
        }
        article: {
            id(intro)
            p: {
                [{{{main.intro}}}]
            }
        }
        article: {
            id(desc)
            p: {
                [{{{main.description}}}]
            }
        }
        article: {
            id(links)
            ul: {
                [{{#each main.externalLinks}}
                    <li> <a href="{{this.href}}" target="{{this.target}}">{{this.text}}</a></li>
                {{/each}}]
            }
        }
    }
  }`