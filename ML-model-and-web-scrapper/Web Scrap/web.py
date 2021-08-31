from bs4 import BeautifulSoup
import requests
import pandas as pd 
import csv


from googleapiclient.discovery import build
from google.oauth2 import service_account


#Adding the JSON key

SERVICE_ACCOUNT_FILE = 'calendar-key.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


creds = None
creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)



# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1sP3FVWIG9_BFrbZMemMNylqZEt2mIjCQcemvH3-vWkk'


service = build('sheets', 'v4', credentials=creds)

# Calling the API of Google Sheets
sheet = service.spreadsheets()
result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                            range="Sheet1!A2:A209").execute()
values = result.get('values', [])



for art in values:
    a= str(art)[1:-1]
    print(a)

#Extracting the title of the product

def get_title(soup):

    try:
        
        title = soup.find("span", attrs={"id":'productTitle'})
 
        title_value = title.string
 
        title_string = title_value.strip()
 
    except AttributeError:
        title_string = ""   
 
    return title_string


#Extracting the price of the product
def get_price(soup):
    try:
        price = soup.find("span", attrs={'id':'priceblock_ourprice'}).string.strip()

    except AttributeError:
 
        try:
            
            price = soup.find("span", attrs={'id':'priceblock_dealprice'}).string.strip()
 
        except:     
            price = ""  
    return price

url1 = "https://www.amazon.com/s?k="
url2 = "&ref=nb_sb_noss_2"

for art in values :

    if __name__ == '__main__':

        #Sending request to Amazon
        HEADERS = ({'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36', 'Accept-Language': 'en-US'})
        

        a= str(art)[1:-1]
        URL = url1+a+url2

        #Receiving HTTP request
        webpage = requests.get(URL, headers=HEADERS)

        #Soup function that contains the data from the website
        soup = BeautifulSoup(webpage.content, "lxml")
        links = soup.find_all("a", attrs={'class':'a-link-normal s-no-outline'})
        links_list = []

        for link in links:
            links_list.append(link.get('href'))

        i=1

        #Print the values of product title and price
        for link in links_list:
            while i < 2: 
                new_webpage = requests.get("https://www.amazon.com" + link, headers=HEADERS)
                new_soup = BeautifulSoup(new_webpage.content, "lxml")
                
                print("Product Title =", get_title(new_soup))
                

                numbers =get_price(new_soup)

                print("Product Price =", numbers)
                
                abc=[[get_title(new_soup),numbers]]

                request = sheet.values().append(spreadsheetId=SAMPLE_SPREADSHEET_ID, range="Sheet2!A2", valueInputOption="USER_ENTERED", insertDataOption="OVERWRITE", body={"values":abc}).execute()    
               
                print()
                print()
                i=i+1
                       