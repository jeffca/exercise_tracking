import psycopg2
import sys

conn_string = "host='ec2-107-21-126-193.compute-1.amazonaws.com' dbname='d44r132kdeefer' user='hvwvyrbinytxga' password='80ddf8ed99a35b2e20971aeb0c5b41bd8fe16009b57fe17083569a74b45aad55'"

conn = psycopg2.connect(conn_string) 

cursor = conn.cursor()

cursor.execute("DROP TABLE runs")
cursor.execute("DROP TABLE trails")

cursor.execute("CREATE TABLE runs (id SERIAL NOT NULL, distance decimal, rundate date, time varchar(255), pacepermile varchar(255), elevationgain int, notes varchar(255), createdAt date, updatedAt date, trailId int)")

cursor.execute("CREATE TABLE trails (id SERIAL NOT NULL, title varchar(255), description text, createdAt date, updatedAt date)");

cursor.execute("INSERT INTO trails (title) VALUES ('Treadmill')")
cursor.execute("INSERT INTO trails (title) VALUES ('Cross Kirkland Corridor')")

conn.commit()