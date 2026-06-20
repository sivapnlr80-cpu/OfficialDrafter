/**
 * Exports styled HTML content as a Word document (.doc) using the MS Word HTML formatting schema.
 * This ensures that when opened in Microsoft Word, it retains fonts, margins, tables, and spacing.
 * @param {string} htmlContent - The raw inner HTML of the document
 * @param {string} fileName - Output file name
 */
export const exportToDoc = (htmlContent, fileName = 'official_document.doc', language = 'English') => {
  const fontName = language === 'Telugu' ? 'Gautami' : 'Tahoma';
  
  // Office XML/HTML wrapper with CSS to configure page sizes, fonts, and table styling
  const documentTemplate = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Government Document</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page WordSection1 {
              size: 8.27in 11.69in; /* A4 size */
              margin: 1.0in 0.79in 1.0in 1.18in; /* Matches 25mm top/bottom, 20mm right, 30mm left margins */
              mso-header-margin: .5in;
              mso-footer-margin: .5in;
              mso-paper-source: 0;
            }
            div.WordSection1 {
              page: WordSection1;
            }
            body {
              font-family: '${fontName}', sans-serif;
              font-size: 12pt;
              color: #000000;
              line-height: 1.5;
            }
            p {
              margin: 0 0 12pt 0;
              text-align: justify;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 12pt 0;
            }
            th, td {
              border: 1px solid #000000;
              padding: 6pt 8pt;
              font-family: '${fontName}', sans-serif;
              font-size: 11pt;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .underline { text-decoration: underline; }
            .mb-2 { margin-bottom: 6pt; }
            .mb-4 { margin-bottom: 12pt; }
            .mb-6 { margin-bottom: 18pt; }
            .mt-6 { margin-top: 18pt; }
            
            /* Official header components */
            .gov-header {
              text-align: center;
              font-weight: bold;
              font-size: 13pt;
              margin-bottom: 18pt;
              text-transform: uppercase;
            }
            .ref-row {
              width: 100%;
              margin-bottom: 18pt;
            }
            .ref-no {
              font-weight: bold;
              float: left;
            }
            .ref-date {
              font-weight: bold;
              float: right;
            }
            .clear {
              clear: both;
            }
            .subject-section {
              margin-bottom: 18pt;
              padding-left: 20pt;
              text-indent: -20pt;
            }
            .signature-block {
              margin-top: 30pt;
              float: right;
              text-align: left;
              width: 250pt;
            }
            .copy-to {
              margin-top: 30pt;
              font-size: 10pt;
            }
            .copy-to-title {
              font-weight: bold;
              text-decoration: underline;
              margin-bottom: 4pt;
            }
            .copy-to-item {
              margin-bottom: 2pt;
              padding-left: 10pt;
            }
          </style>
        </head>
        <body>
          <div class="WordSection1">
            ${htmlContent}
          </div>
        </body>
        </html>`;

  // Byte Order Mark (BOM) to ensure correct encoding (UTF-8)
  const blob = new Blob(['\ufeff' + documentTemplate], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
