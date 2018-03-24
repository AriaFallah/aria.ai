import * as React from 'react';
import * as util from 'util';
import { minify } from 'html-minifier';
import { Helmet } from 'react-helmet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Site } from './template/Site';

export function makePage(
  pageContent: React.ReactElement<any>,
  css: string,
  siteProps: any
): string {
  const body = renderToStaticMarkup(<Site {...siteProps}>{pageContent}</Site>);
  const helmet = Helmet.renderStatic();
  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      ${helmet.title.toString()}
      <meta charset="utf-8" />
      ${helmet.meta.toString()}
      <link
        rel="shortcut icon"
        type="image/png"
        href=/assets/icons/favicon.ico
      />
      <style>
        ${css}
      </style>
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      ${body}

      <noscript id="deferred-styles">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Serif+Pro|Source+Sans+Pro">
        ${helmet.link.toString()}
      </noscript>
      <script>
        var loadDeferredStyles = function () {
          var addStylesNode = document.getElementById("deferred-styles");
          var replacement = document.createElement("div");
          replacement.innerHTML = addStylesNode.textContent;
          document.body.appendChild(replacement)
          addStylesNode.parentElement.removeChild(addStylesNode);
        };
        var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (raf) raf(function () { window.setTimeout(loadDeferredStyles, 0); });
        else window.addEventListener('load', loadDeferredStyles);
      </script>
      
      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-79031036-2"></script>
      <script>
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-79031036-2');
        }
      </script>
    </body>
  </html>`;

  return minify(html, { collapseWhitespace: true });
}
