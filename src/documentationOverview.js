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
            p: { [
                Jackyll SSG uses a few bootstraps off of a few existing technologies:
                <ul>
                    <li>Handlebars Templating Engine</li>
                    <li>Sanity IO</li>
                    <li>Netlify</li>
                </ul>
            ] }
            p: { [
                Plus something (kinda) new: the Jackyll Compiler.
            ] }
            p: { [
                What do each of these things do and why should I care, you ask? Well... 
                For any static site generator you really need two, actually three things:
                <ol>
                <li>Templating Engine. Handlebars satisfies this role.</li>
                <li>Data source. We're getting fancy and using Sanity IO as a CMS for our data. You could use a JSON file though.</li>
                <li>Somewhere to host your website! We're using Netlify for their webhooks to integrate with Github.</li>
                </ol>
            ]}
        }
        article: {
            p: {[
                What's this Jackal compiler about? Well, for some static site generators, you just write an HTML file with
                the additional syntax that your templating engine needs. So, for HTML and Handlebars you'd do something like this:
                <br/>
                <blockquote>
                    <code>
                        <h1>"{{some.value}}"</h1>
                    </code>
                </blockquote>
                <br/>
                And the Handlebars compiler would dump out:
                <blockquote>
                    <code>
                        <h1>My heading!!!</h1>
                    </code>
                </blockquote>
                <br/>
                Ever since seeing what Svelte can do with a compiler I've been pretty interested in learning about them.
                Sooo I worked throught the <a href="https://github.com/jamiebuilds/the-super-tiny-compiler" target="_blank" rel="norefferer noopener">The Super Tiny Compiler</a> and
                ended up with the Jackle/Jackyll/Jackal syntax for writing HTML. Only gotcha is you can't put square brackets in your content! No big deal right?
            ]}
            p: {[
                Why do this? Doesn't something like this already exist? Yes, check out <a href="https://pugjs.org/api/getting-started.html" target="_blank" rel="norefferer noopener">Pug</a>. But I
                wanted to learn about compilers and static site generators, so here we are! Deal with it.
            ]}
            p {
                [I'll go into more detail about setting up all of the pieces and explaining the main build script along with the compiler on subsequent pages. So if you're ready to dive in, click the next page link below! ]
            }
        }
    }
}`
