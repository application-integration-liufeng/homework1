# -*- coding: utf-8 -*-
import xml.dom.minidom as Dom
from xml.dom import minidom
import pymysql

connect = pymysql.connect(host='localhost', user='root', passwd='123456', db='stock', charset='utf8')
db = connect.cursor()
db.execute("select code,location from sina")
data = db.fetchall()
j = 0
doc = Dom.Document()
root_node = doc.createElement("stocks")
doc.appendChild(root_node)

for i in data:
    j+=1
    db.execute("select name,area,industry,list_date from tushare where symbol = "+i[0])
    data1 = db.fetchone()
    s = data1[0]
    s = s.replace("*","")
    name = doc.createElement(s)
    area = doc.createElement("area")
    code = doc.createElement("code")
    industry = doc.createElement("industry")
    list_date = doc.createElement("list_date")
    yesterday = doc.createElement("yesterday")
    chg = doc.createElement("chg")
    percent = doc.createElement("percent")
    market_capital = doc.createElement("market_capital")
    root_node.appendChild(name)
    name.appendChild(code)
    name.appendChild(area)
    name.appendChild(industry)
    name.appendChild(list_date)
    name.appendChild(yesterday)
    name.appendChild(chg)
    name.appendChild(percent)
    name.appendChild(market_capital)

    code_value = doc.createTextNode(i[0])
    code.appendChild(code_value)
    area_value = doc.createTextNode(data1[1])
    area.appendChild(area_value)
    industry_value = doc.createTextNode(data1[2])
    industry.appendChild(industry_value)
    list_date_value = doc.createTextNode(data1[3])
    list_date.appendChild(list_date_value)

    db.execute("select yesterday from sina where code = " + i[0])
    data1 = db.fetchone()

    yesterday_value = doc.createTextNode(str(data1[0]))
    yesterday.appendChild(yesterday_value)

    db.execute("select chg,percent,market_capital from xueqiu where symbol = \'SZ" + i[0]+"\'")
    data1 = db.fetchone()

    chg_value = doc.createTextNode(str(data1[0]))
    chg.appendChild(chg_value)
    percent_value = doc.createTextNode(str(data1[1]))
    percent.appendChild(percent_value)
    market_capital_value = doc.createTextNode(str(data1[2]))
    market_capital.appendChild(market_capital_value)

    if j>50:
        break
db.close()

f = open("stock.xml", "w")
f.write(doc.toprettyxml(indent="\t", newl="\n", encoding="utf-8"))
f.close()