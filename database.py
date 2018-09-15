import psycopg2
import sys

conn_string = "host='ec2-107-21-126-193.compute-1.amazonaws.com' dbname='d44r132kdeefer' user='hvwvyrbinytxga' password='80ddf8ed99a35b2e20971aeb0c5b41bd8fe16009b57fe17083569a74b45aad55'"

conn = psycopg2.connect(conn_string) 

cursor = conn.cursor()

cursor.execute("DROP TABLE run")

cursor.execute("CREATE TABLE run (id SERIAL NOT NULL, distance int, time varchar(255), pacepermile int)")

conn.commit()