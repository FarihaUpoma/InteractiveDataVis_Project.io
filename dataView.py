#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 21 16:15:08 2021

@author: farihamoomtaheen
"""

import pandas as pd


df1 = pd.read_csv("data/titanic_passenger_list.csv");

df2 = pd.read_csv("data/iris.csv");

df3 = pd.read_csv("data/science-and-technology.csv");


df4 = pd.read_csv("data/srsatact.csv");

df5 = pd.DataFrame();
df5["g"] = ["banana", "poacee", "sorgho", "triti"];
df5["nitro"] = [12,6,11,19];
df5["norm"] = [1,6,28,6];
df5["stress"] = [13,33,12,1];

df5.to_csv("data/bar.csv", index = False);

df6 = pd.DataFrame()
places = list(set(df1["home.dest"]))
print(len(places))
df6['p'] = places
l = len(places)
alive = [0] * l
dead = [0] * l
df6['alive'] = alive
df6['dead'] = dead
df6['total'] = [0] * l
for i in range(len(places)):
    p = df1["home.dest"][i]
    df6.loc[ df6["p"] == p, "total" ] = df6.loc[ df6["p"] == p, "total" ] + 1
    if df1["survived"][i] == 1:
        # print(df6.loc[ df6["p"] == p, "alive" ])
        df6.loc[df6["p"] == p, "alive"] = df6.loc[ df6["p"] == p, "alive" ] + 1
    else:
        df6.loc[df6["p"] == p, "dead"] = df6.loc[df6["p"] == p, "dead"] + 1

#
# .append("svg")
#             .attr("width", layer.width + margin.left + margin.right)
#             .attr("height", layer.height + margin.top + margin.bottom)
#
#
#         var background = d3.select("#vis_1")
#             .append("svg")
#             .style("background-color", "grey")
#             .attr("width", layer.width)
#             .attr("height", layer.height)
#             .attr("transform",
#                 `translate(-${layer.width + margin.right}, -${margin.top})`);
