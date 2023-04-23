# Data Visualization project-Berkley Earth
The project is aimed at visualizing the temperature anomalies worldwide since 1850, using Berkley Earth Data. It consists of an interacive world map with the option to see the animation which can also be controlled using the slider or play/pause button, a zoom function, tooltip and a clickable legend. It also allows to select a country on the map and look at their individual data in the form of a line chart and climate stripes. There is another tab to check the top 10 countries with biggest anomalies with 5-year and 10-year anomaly values.

#### The project folder contains:

-Countries folder contains data in .txt format.

-CountriesCSV contains all countries data converted from .txt to csv.

#### Data folder contains
 -CountriesCSV folder which contains csv files of data of each country.\
 -data-cleaning folder contains the .py files for downloading and pre-processing data.\
 -json folder contains the processed data files for all countries in json format.\
     -top10.csv contains world data of top 10 years with max anamoly.\
   -map contains world geojson data.


#### scripts folder contains
   -color.js which define colours.\
   -line.js for line charts.\
   -warming_strips.js used to make warming strips.\
   -script.js is the main js file.
   
 style contains styles.js.
##### index.html is the main page.
 
   
