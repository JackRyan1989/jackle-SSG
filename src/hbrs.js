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
                [{{{hbrs.heading}}}]
            }
        }
        article: {
            id(intro)
            p: {
                [{{{hbrs.content}}}]
            }
        }
        aside: {
            ul: {
                [{{#each nav-links.internalLinks}}
                    <li class="pad2"> <a href="{{this.href}}" >{{this.text}}</a></li>
                {{/each}}]
            }
        }
        footer: {
            class(pad2)
            p: {
                [{{{footer.footerContent}}}]
            }
            div: {
                [{{#each footer.socialLinks}}
                     <a class="pad1" href="{{this.href}}" target="{{this.target}}">{{this.text}}</a>
                {{/each}}]
            }
        }
    }
}`