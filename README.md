# DOUBLE FACADE

## INTRODUCTION

[Single-Page Applications](https://developer.mozilla.org/en-US/docs/Glossary/SPA), although having multiple advantages when it comes to developing them and also deploying them, suffer from the common problem of making the website appear as empty and void of content for search engines. This setback is so great that it is often the reason for not going forward with a project or then opting for a heavyweight approach, such as server-side rendering.

This project aims to address that by creating a server that has a **double facade**: one facade for web browsers, one facade for search engines. When the server gets an HTTP request from a client, it tries to figure out if the client is a web browser or a search engine. If it has decided that it's a web browser, it will serve the lightweight and barebones HTML page that renders everything using JavaScript. If it has decided that it's a search engine, it will serve a cached version of the page that has been rendered by the web browser.