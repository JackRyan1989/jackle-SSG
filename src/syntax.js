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
                [{{{compiler.heading}}}]
            }
        }
        article: {
            p: {
                [ {{{compiler.compiler}}} ]
            }
        }
        article: {
            p: {
                [ {{{compiler.syntax}}} ]
            }
        }
        aside: {
            ul: {
                [{{#each nav-links.internalLinks}}
                    <li class="pad2"> <a href="{{this.href}}" >{{this.text}}</a></li>
                {{/each}}]
            }
        }
    }
}`