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
                [{{{overview.heading}}}]
            }
        }
        article: {
            id(intro)
            p: { [
                {{{overview.content}}}
            ]}
        }
        aside: {
            ul: {
                [{{#each nav-links.internalLinks}}
                    <li> <a href="{{this.href}}" >{{this.text}}</a></li>
                {{/each}}]
            }
        }
        footer: {
            p: {
                [{{{footer.footerContent}}}]
            }
            ul: {
                [{{#each footer.socialLinks}}
                    <li> <a href="{{this.href}}" target="{{this.target}}">{{this.text}}</a></li>
                {{/each}}]
            }
        }
    }
}`
