# DOUBLE FACADE

## INTRODUCTION

[Single-Page Applications](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPAs), although having multiple advantages when it comes to developing them and also deploying them, suffer from the common problem of making the website appear as empty and void of content for search engines. This setback is so unnacceptable that it is often the reason for not going forward with a project or then opting for a heavyweight approach, such as server-side rendering.

This project aims to address that by creating a server that has a **double facade**: one facade for web browsers, one facade for search engines. When the server gets an HTTP request from a client, it tries to figure out if the client is a web browser or a search engine. If it has decided that it's a web browser, it will serve the lightweight and barebones HTML page that renders everything using JavaScript. If it has decided that it's a search engine, it will serve a cached version of the page that has been rendered by the web browser.

## USE CASES & ADVANTAGES

The great advantage that SPAs bring is that they **separate the concerns** in a way that allows for back-end developers and front-end developers to **work independently**, only meeting for discussion at the narrow pass where the data flows back and forth between the server and the client (web browser). The back-end developers should focus on storing information in databases and how to process such data, while the front-end developers should focus on how to get the data and then render something for the user (image, document).

