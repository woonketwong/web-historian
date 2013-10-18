# schema for Web Historian:
# Table stores the location of files for all websites archived by the Web Historian app

# create database for the table
CREATE database webHistorian;
USE webHistorian;

CREATE table siteIndex
  (url varchar(1000),
  filepath varchar(1200));