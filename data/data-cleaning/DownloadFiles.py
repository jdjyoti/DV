from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import wget
import os
import pandas as pd
import csv
import json

path = r'C:\Users\a.fermi\Documents\Data Visualization\Countries'
csvPath = r'dC:\Users\a.fermi\Documents\Data Visualization\CountriesCSV'
for i in range (2,241):
    try:
        driver = webdriver.Edge()
        driver.get("http://berkeleyearth.lbl.gov/country-list/")
        driver.find_element_by_xpath("//main[@id='main']/div[2]/div/table/tbody/tr["+str(i)+"]/td/a").click()
        driver.find_element_by_xpath("//a[contains(text(),'Data Table')]").click()
        wget.download(driver.current_url,path)
        driver.quit()
    except:
        print(driver.current_url)
   
list_of_files = []

for root, dirs, files in os.walk(path):
	for file in files:
		list_of_files.append(os.path.join(root,file))
for name in list_of_files:
    try:
        with open(name, 'r') as fr:
            lines = fr.readlines() #reads the lines of files
            ptr = 1
            with open(name, 'w') as fw:
                for line in lines:
                    if ptr > 71:
                        fw.write(line)  #writes to the files
                    ptr += 1
            df = pd.read_csv(name,delim_whitespace=True)
            df.columns = ["Year","Month","Monthly Anomaly","Unc1","Annual Anomaly","Unc2","Five-year Anomaly"
            ,"Unc3","Ten-year Anomaly","Unc4","Twenty-year Anomaly","Unc5"]
            df.drop(["Unc1", "Unc2", "Unc3","Unc4","Unc5"], axis=1, inplace=True) 
            csvName = name.split("\\")[6].split("\\")[0].split(".")[0]+ ".csv"
            df.to_csv(csvPath+csvName, index = None)
    except:
        print("Couldnt delete", name)

for root, dirs, files in os.walk(csvPath):
	for file in files:
		list_of_files.append(os.path.join(root,file))
temp_year_data = []
for name in list_of_files:
            with open(name, encoding='utf-8') as csvf:
                csvReader = csv.DictReader(csvf)
                for rows in csvReader:
                    year = int(rows['Year'])
                    data = {}
                    # twenty_years = [1850,1870,1890,1910,1930]
                    # ten_years = [1945,1955,1965,1975,1985,1995,2005]
                    # if(year in twenty_years and  int(rows['Month']) == 6):
                    #     data['country'] = str(name.replace("-TAVG-Trend.csv","").replace("data\\CountriesCSV\\","")).replace("-"," ")
                    #     data['year'] = year
                    #     data['anomaly']  = rows['Twenty-year Anomaly']
                    #     temp_year_data.append(data)
                    # elif(year in ten_years and  int(rows['Month']) == 6):
                    #     data['country'] = str(name.replace("-TAVG-Trend.csv","").replace("data\\CountriesCSV\\","")).replace("-"," ")
                    #     data['year'] = year
                    #     data['anomaly']  = rows['Ten-year Anomaly']
                    #     temp_year_data.append(data)
                    if(year > 1850 and  int(rows['Month']) == 6):
                        data['country'] = str(name.replace("-TAVG-Trend.csv","").replace("data\\CountriesCSV\\","")).replace("-"," ")
                        data['year'] = year
                        data['anomaly']  = rows['Annual Anomaly']
                        temp_year_data.append(data)

json_object = json.dumps(temp_year_data)
with open("data\\json\\countries_year.json", "w") as outfile:
    outfile.write(json_object)
 