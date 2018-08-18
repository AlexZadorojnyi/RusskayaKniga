Русская Книга (Russkaya Kniga)
==============
This is a single-page promotional website for a Russian book store in Richmond Hill, Ontario. The aim of this website is to provide information about the business, display promotional material, and showcase selected books and other items to both Russian and English Speaking visitors.

About
--------------
This website was built to eliminate manually changing the HTML markdown as much as possible. All non-permanent information on the website is stored in a database and is then injected into the HTML file using AngularJS. This makes the website easy to maintain and change as time goes on.
This website also uses responsive web design and will change depending on the medium it is viewed on.

Built With
--------------
- HTML & CSS
- AngularJS
- JavaScript & jQuery

Structure
--------------
- `index.html` - Redirects visitors from the base URL to the Russian language specific HTML file to simplify access to the website and to standardize internal directories.
- `ru/index.html & en/index.html` - HTML markdown comprising the website. Russian and English versions are stored in the appropriate directories.
- `stylesheet.css` - CSS stylesheet supporting responsive web design.
- `mainApp.js` - Defines the functionality of the promotional carousel and the item containers, stores the database of items and promotional material, and populates the page with database items.