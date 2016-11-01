
var url = "http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// Asynchronous download PDF
PDFJS.getDocument(url)
  .then(function(pdf) {

    // Get div#container and cache it for later use
    var container = document.getElementById("container");

    // Loop from 1 to total_number_of_pages in PDF document
    for (var i = 1; i <= pdf.numPages; i++) {

        // Get desired page
        pdf.getPage(i).then(function(page) {

          var scale = 1.5;
          var viewport = page.getViewport(scale);
          var div = document.createElement("div");

          // Set id attribute with page-#{pdf_page_number} format
          div.setAttribute("id", "page-" + (page.pageIndex + 1));

          // This will keep positions of child elements as per our needs
          div.setAttribute("style", "position: relative");

          // Append div within div#container
          container.appendChild(div);

          // Create a new Canvas element
          var canvas = document.createElement("canvas");

          // Append Canvas within div#page-#{pdf_page_number}
          div.appendChild(canvas);

          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          // Render PDF page
          page.render(renderContext)
            .then(function() {
              // Get text-fragments
              return page.getTextContent();
            })
            .then(function(textContent) {
              // Create div which will hold text-fragments
              var textLayerDiv = document.createElement("div");

              // Set its class to textLayer which have required CSS styles
              textLayerDiv.setAttribute("class", "textLayer");

              // Append newly created div in `div#page-#{pdf_page_number}`
              div.appendChild(textLayerDiv);

              // Create new instance of TextLayerBuilder class
              var textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
              });

              // Set text-fragments
              textLayer.setTextContent(textContent);

              // Render text-fragments
              textLayer.render();
            });

          // create another canvas that's on top of this one for annotations
          var annotationLayerDiv = document.createElement("div");
          annotationLayerDiv.setAttribute("class", "annotationLayer");
          annotationLayerDiv.setAttribute("name", "annotationLayer");

          div.appendChild(annotationLayerDiv);

          var annotationCanvas = document.createElement("canvas");
          annotationLayerDiv.appendChild(annotationCanvas);

          var context2 = annotationCanvas.getContext('2d');
          annotationCanvas.height = viewport.height;
          annotationCanvas.width = viewport.width;

          context2.lineWidth = 1;
          context2.fillStyle = "#CC00FF";
          context2.lineStyle = "#ffff00";
          context2.font = "18px sans-serif";
          context2.fillText("Fill Text, 18px, sans-serif", 100, 200);

        });
      }
    });
