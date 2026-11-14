// รายการชั้นข้อมูล สัญลักษณ์ และฟิลด์ที่แสดงใน popup (สร้างจากไฟล์ .lyrx ของ ArcGIS Pro)
// แก้ชื่อชั้นข้อมูลที่ "name" และแก้ชื่อฟิลด์ใน popup ที่ "alias" ได้โดยตรง
window.LAYER_GROUPS = [
 {
  "name": "ขอบเขตการปกครอง",
  "layers": [
   {
    "name": "จังหวัด",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\น่าน2567_ปีล่าสุด\\น่าน2567\\ขอบเขตการปกครอง",
     "factory": "Shapefile",
     "dataset": "น่าน_Pro.shp"
    },
    "joined": false,
    "fields": [],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "polygon",
      "stroke": {
       "hex": "#ffffff",
       "a": 1.0
      },
      "width": 2,
      "fill": {
       "hex": "#e1e1e1",
       "a": 0.0
      }
     }
    },
    "geom": "polygon",
    "id": "Nan_Province"
   },
   {
    "name": "อำเภอ",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\น่าน2567_ปีล่าสุด\\น่าน2567\\ขอบเขตการปกครอง",
     "factory": "Shapefile",
     "dataset": "น่าน_Amp.shp"
    },
    "joined": false,
    "fields": [],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "polygon",
      "stroke": {
       "hex": "#ffffff",
       "a": 1.0
      },
      "width": 1,
      "dash": [
       5,
       5
      ],
      "fill": {
       "hex": "#d2e7fc",
       "a": 0.0
      }
     }
    },
    "geom": "polygon",
    "id": "Nan_Amphoe"
   },
   {
    "name": "ตำบล",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\น่าน2567_ปีล่าสุด\\น่าน2567\\ขอบเขตการปกครอง",
     "factory": "Shapefile",
     "dataset": "น่าน_Tam.shp"
    },
    "joined": false,
    "fields": [
     {
      "f": "TAMBON_IDN",
      "alias": "TAMBON_IDN"
     },
     {
      "f": "TAM_CODE",
      "alias": "TAM_CODE"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_IDN",
      "alias": "AMPHOE_IDN"
     },
     {
      "f": "AMP_CODE",
      "alias": "AMP_CODE"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     },
     {
      "f": "AMPHOE_E",
      "alias": "AMPHOE_E"
     },
     {
      "f": "PROV_CODE",
      "alias": "PROV_CODE"
     },
     {
      "f": "PROV_NAM_T",
      "alias": "PROV_NAM_T"
     },
     {
      "f": "PROV_NAM_E",
      "alias": "PROV_NAM_E"
     },
     {
      "f": "P_CODE",
      "alias": "P_CODE"
     },
     {
      "f": "remark",
      "alias": "remark"
     }
    ],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "polygon",
      "stroke": {
       "hex": "#000000",
       "a": 1.0
      },
      "width": 1,
      "dash": [
       5,
       3
      ],
      "fill": {
       "hex": "#fccfd9",
       "a": 0.0
      }
     }
    },
    "geom": "polygon",
    "id": "Nan_Tambon"
   }
  ]
 },
 {
  "name": "พื้นที่อ่อนไหวต่อแผ่นดินถล่ม (Landslide Susceptibility)",
  "layers": [
   {
    "name": "จุดเกิดเหตุการณ์ธรณีพิบัติภัยดินถล่ม (พ.ศ. 2532 -2562)",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "LANDSLIDE_INVENTORY_Nan"
    },
    "joined": true,
    "fields": [
     {
      "f": "INVENT_ID",
      "alias": "INVENT_ID"
     },
     {
      "f": "UTM_E",
      "alias": "UTM_E"
     },
     {
      "f": "UTM_N",
      "alias": "UTM_N"
     },
     {
      "f": "TAMBON",
      "alias": "TAMBON"
     },
     {
      "f": "DISTRICT",
      "alias": "DISTRICT"
     },
     {
      "f": "PROVINCE",
      "alias": "PROVINCE"
     },
     {
      "f": "YEAR_DATA",
      "alias": "YEAR_DATA"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "point",
      "markers": [
       {
        "size": 5,
        "shape": "circle",
        "fill": {
         "hex": "#895a44",
         "a": 1.0
        },
        "stroke": {
         "hex": "#ffffff",
         "a": 1.0
        },
        "width": 0.5
       }
      ]
     }
    },
    "geom": "point",
    "id": "LANDSLIDE_INVENTORY_Nan"
   },
   {
    "name": "พื้นที่อ่อนไหวต่อแผ่นดินถล่ม (จากผลการศึกษา)",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Reclass_WLC1_Polygon"
    },
    "joined": true,
    "fields": [
     {
      "f": "Id",
      "alias": "Id"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "Area_km2",
      "alias": "Area_km2"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "gridcode",
     "classes": [
      {
       "label": "สูงมาก (5)",
       "value": "5",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#730000",
         "a": 1.0
        }
       }
      },
      {
       "label": "สูง (4)",
       "value": "4",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ff5500",
         "a": 1.0
        }
       }
      },
      {
       "label": "ปานกลาง (3)",
       "value": "3",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ffff73",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำ (2)",
       "value": "2",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#aaff00",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำมาก (1)",
       "value": "1",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0,
        "fill": {
         "hex": "#38a800",
         "a": 1.0
        }
       }
      }
     ]
    },
    "geom": "polygon",
    "id": "Reclass_WLC1_Polygon"
   },
   {
    "name": "พื้นที่อ่อนไหวต่อแผ่นดินถล่ม (กรมทรัพยากรธรณี)",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "LANDSLIDE_SUSCEPTIBILITY_Nan"
    },
    "joined": true,
    "fields": [
     {
      "f": "Id",
      "alias": "Id"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "Level_T",
      "alias": "Level_T"
     },
     {
      "f": "Level_E",
      "alias": "Level_E"
     },
     {
      "f": "Desc_T",
      "alias": "Desc_T"
     },
     {
      "f": "Desc_E",
      "alias": "Desc_E"
     },
     {
      "f": "Score",
      "alias": "Score"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "gridcode",
     "classes": [
      {
       "label": "สูงมาก (5)",
       "value": "5",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#a80000",
         "a": 1.0
        }
       }
      },
      {
       "label": "สูง (4)",
       "value": "4",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ff5500",
         "a": 1.0
        }
       }
      },
      {
       "label": "ปานกลาง (3)",
       "value": "3",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ffff73",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำ (2)",
       "value": "2",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#d1ff73",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำมาก (1)",
       "value": "1",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#6e6e6e",
         "a": 0.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#38a800",
         "a": 1.0
        }
       }
      }
     ]
    },
    "geom": "polygon",
    "id": "LANDSLIDE_SUSCEPTIBILITY_Nan"
   }
  ]
 },
 {
  "name": "ข้อมูลความเปราะบาง",
  "layers": [
   {
    "name": "สถานพยาบาล",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "health_facilitie_SpatialJoin"
    },
    "joined": true,
    "fields": [
     {
      "f": "Ministry",
      "alias": "Ministry"
     },
     {
      "f": "Department",
      "alias": "Department"
     },
     {
      "f": "Agency",
      "alias": "สถานพยาบาล"
     },
     {
      "f": "Lat",
      "alias": "ละติจูด"
     },
     {
      "f": "Long",
      "alias": "ลองจิจูด"
     },
     {
      "f": "Address",
      "alias": "ที่อยู่"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "point",
      "markers": [
       {
        "size": 8,
        "shape": "poly",
        "rings": [
         [
          [
           6,
           11
          ],
          [
           5.98,
           17
          ],
          [
           10.98,
           17
          ],
          [
           11,
           11
          ],
          [
           17,
           11
          ],
          [
           17,
           6
          ],
          [
           11,
           6
          ],
          [
           11,
           0
          ],
          [
           6,
           0
          ],
          [
           6,
           6
          ],
          [
           0,
           5.98
          ],
          [
           0,
           10.98
          ],
          [
           6,
           11
          ]
         ]
        ],
        "frame": {
         "xmin": 0,
         "ymin": 0,
         "xmax": 17,
         "ymax": 17
        },
        "fill": {
         "hex": "#e60000",
         "a": 1.0
        },
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0
       }
      ]
     }
    },
    "geom": "point",
    "id": "health_facilitie_SpatialJoin"
   },
   {
    "name": "ศูนย์พักพิงชั่วคราว",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "ศูนย์พักพิงชั่วค_SpatialJoin"
    },
    "joined": true,
    "fields": [
     {
      "f": "ภาค",
      "alias": "ภาค"
     },
     {
      "f": "จังหวัด",
      "alias": "จังหวัด"
     },
     {
      "f": "อำเภอ",
      "alias": "อำเภอ"
     },
     {
      "f": "ตำบล",
      "alias": "ตำบล"
     },
     {
      "f": "หมู่บ้าน_ชุมชน",
      "alias": "หมู่บ้าน/ชุมชน"
     },
     {
      "f": "สถานที่",
      "alias": "สถานที่"
     },
     {
      "f": "รองรับ",
      "alias": "รองรับ (คน)"
     },
     {
      "f": "สถานที่รับผิดชอบอปท_",
      "alias": "สถานที่รับผิดชอบ อปท."
     },
     {
      "f": "ชื่อ___สกุล_ผู้ประสาน",
      "alias": "ชื่อ - สกุล ผู้ประสานงาน"
     },
     {
      "f": "หมายเลขโทรศัพท์",
      "alias": "หมายเลขโทรศัพท์"
     },
     {
      "f": "ไฟฟ้า",
      "alias": "ไฟฟ้า"
     },
     {
      "f": "ประปา",
      "alias": "ประปา"
     },
     {
      "f": "สุขา",
      "alias": "สุขา"
     },
     {
      "f": "ละติจูด",
      "alias": "ละติจูด"
     },
     {
      "f": "ลองจิจูด",
      "alias": "ลองจิจูด"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "point",
      "markers": [
       {
        "size": 7.285714285714286,
        "shape": "poly",
        "rings": [
         [
          [
           13,
           9
          ],
          [
           13,
           6
          ],
          [
           14,
           5
          ],
          [
           14,
           4
          ],
          [
           3,
           4
          ],
          [
           3,
           5
          ],
          [
           4,
           6
          ],
          [
           4,
           9
          ],
          [
           3,
           9
          ],
          [
           3,
           10
          ],
          [
           4,
           10
          ],
          [
           13,
           10
          ],
          [
           14,
           10
          ],
          [
           14,
           9
          ],
          [
           13,
           9
          ]
         ],
         [
          [
           11,
           9
          ],
          [
           11,
           6
          ],
          [
           12,
           6
          ],
          [
           12,
           9
          ],
          [
           11,
           9
          ]
         ],
         [
          [
           10,
           6
          ],
          [
           10,
           9
          ],
          [
           7,
           9
          ],
          [
           7,
           6
          ],
          [
           8,
           6
          ],
          [
           8,
           7
          ],
          [
           9,
           7
          ],
          [
           9,
           6
          ],
          [
           10,
           6
          ]
         ],
         [
          [
           6,
           6
          ],
          [
           6,
           9
          ],
          [
           5,
           9
          ],
          [
           5,
           6
          ],
          [
           6,
           6
          ]
         ],
         [
          [
           14,
           11
          ],
          [
           3,
           11
          ],
          [
           8.5,
           14
          ],
          [
           14,
           11
          ]
         ]
        ],
        "frame": {
         "xmin": 0,
         "ymin": 0,
         "xmax": 17,
         "ymax": 17
        },
        "fill": {
         "hex": "#0070ff",
         "a": 1.0
        },
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0
       },
       {
        "size": 8,
        "shape": "circle",
        "fill": {
         "hex": "#ffffff",
         "a": 1.0
        },
        "stroke": {
         "hex": "#a7a9ac",
         "a": 1.0
        },
        "width": 0.5
       }
      ]
     }
    },
    "geom": "point",
    "id": "Shelter_SpatialJoin"
   },
   {
    "name": "ตำแหน่งหมู่บ้าน",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "village_Nan_Intersect"
    },
    "joined": true,
    "fields": [
     {
      "f": "DOLACODE",
      "alias": "DOLACODE"
     },
     {
      "f": "NRDCODE",
      "alias": "NRDCODE"
     },
     {
      "f": "VILL_NO",
      "alias": "VILL_NO"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "gridcode",
     "classes": [
      {
       "label": "สูงมาก",
       "value": "5",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 5,
          "shape": "circle",
          "fill": {
           "hex": "#a80000",
           "a": 1.0
          },
          "stroke": {
           "hex": "#ffffff",
           "a": 1.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "สูง",
       "value": "4",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 3,
          "shape": "circle",
          "fill": {
           "hex": "#ff5500",
           "a": 1.0
          },
          "stroke": {
           "hex": "#ffffff",
           "a": 1.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ปานกลาง",
       "value": "3",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 5,
          "shape": "circle",
          "fill": {
           "hex": "#ffff00",
           "a": 1.0
          },
          "stroke": {
           "hex": "#ffffff",
           "a": 1.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ต่ำ",
       "value": "2",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 5,
          "shape": "circle",
          "fill": {
           "hex": "#aaff00",
           "a": 1.0
          },
          "stroke": {
           "hex": "#ffffff",
           "a": 1.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ต่ำมาก",
       "value": "1",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 5,
          "shape": "circle",
          "fill": {
           "hex": "#38a800",
           "a": 1.0
          },
          "stroke": {
           "hex": "#ffffff",
           "a": 1.0
          },
          "width": 0.7
         }
        ]
       }
      }
     ]
    },
    "geom": "point",
    "id": "village_Nan_Intersect"
   },
   {
    "name": "ประชากรรวม",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Pop_Nan_point"
    },
    "joined": true,
    "fields": [
     {
      "f": "pointid",
      "alias": "pointid"
     },
     {
      "f": "grid_code",
      "alias": "จำนวนประชากรต่อกริด (คน)"
     },
     {
      "f": "Reclass_WLC1",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "Reclass_WLC1",
     "classes": [
      {
       "label": "สูงมาก",
       "value": "5",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 2,
          "shape": "circle",
          "fill": {
           "hex": "#a80000",
           "a": 1.0
          },
          "stroke": {
           "hex": "#000000",
           "a": 0.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "สูง",
       "value": "4",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 2,
          "shape": "circle",
          "fill": {
           "hex": "#ff5500",
           "a": 1.0
          },
          "stroke": {
           "hex": "#000000",
           "a": 0.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ปานกลาง",
       "value": "3",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 2,
          "shape": "circle",
          "fill": {
           "hex": "#ffff73",
           "a": 1.0
          },
          "stroke": {
           "hex": "#000000",
           "a": 0.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ต่ำ",
       "value": "2",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 2,
          "shape": "circle",
          "fill": {
           "hex": "#d1ff73",
           "a": 1.0
          },
          "stroke": {
           "hex": "#000000",
           "a": 0.0
          },
          "width": 0.7
         }
        ]
       }
      },
      {
       "label": "ต่ำมาก",
       "value": "1",
       "symbol": {
        "kind": "point",
        "markers": [
         {
          "size": 2,
          "shape": "circle",
          "fill": {
           "hex": "#38a800",
           "a": 1.0
          },
          "stroke": {
           "hex": "#000000",
           "a": 0.0
          },
          "width": 0.7
         }
        ]
       }
      }
     ]
    },
    "geom": "point",
    "id": "Pop_Nan_point"
   },
   {
    "name": "โครงข่ายถนน",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "road_Nan_main_PairwiseInters"
    },
    "joined": true,
    "fields": [
     {
      "f": "fclass",
      "alias": "fclass "
     },
     {
      "f": "name",
      "alias": "name"
     },
     {
      "f": "oneway",
      "alias": "oneway"
     },
     {
      "f": "maxspeed",
      "alias": "maxspeed"
     },
     {
      "f": "layer",
      "alias": "layer"
     },
     {
      "f": "bridge",
      "alias": "bridge"
     },
     {
      "f": "tunnel",
      "alias": "tunnel"
     },
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "gridcode",
     "classes": [
      {
       "label": "สูงมาก",
       "value": "5",
       "symbol": {
        "kind": "line",
        "stroke": {
         "hex": "#a80000",
         "a": 1.0
        },
        "width": 1
       }
      },
      {
       "label": "สูง",
       "value": "4",
       "symbol": {
        "kind": "line",
        "stroke": {
         "hex": "#ff5500",
         "a": 1.0
        },
        "width": 1
       }
      },
      {
       "label": "ปานกลาง",
       "value": "3",
       "symbol": {
        "kind": "line",
        "stroke": {
         "hex": "#ffff73",
         "a": 1.0
        },
        "width": 1
       }
      },
      {
       "label": "ต่ำ",
       "value": "2",
       "symbol": {
        "kind": "line",
        "stroke": {
         "hex": "#d1ff73",
         "a": 1.0
        },
        "width": 1
       }
      },
      {
       "label": "ต่ำมาก",
       "value": "1",
       "symbol": {
        "kind": "line",
        "stroke": {
         "hex": "#38a800",
         "a": 1.0
        },
        "width": 1
       }
      }
     ]
    },
    "geom": "line",
    "id": "road_Nan_main_PairwiseInters"
   },
   {
    "name": "ขอบเขตอาคาร",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Building_Nan_Intersect"
    },
    "joined": true,
    "fields": [
     {
      "f": "gridcode",
      "alias": "ระดับความเสี่ยง"
     },
     {
      "f": "TAM_NAM_T",
      "alias": "TAM_NAM_T"
     },
     {
      "f": "AMPHOE_T",
      "alias": "AMPHOE_T"
     }
    ],
    "render": {
     "kind": "unique",
     "field": "gridcode",
     "classes": [
      {
       "label": "สูงมาก",
       "value": "5",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#a80000",
         "a": 1.0
        }
       }
      },
      {
       "label": "สูง",
       "value": "4",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ff5500",
         "a": 1.0
        }
       }
      },
      {
       "label": "ปานกลาง",
       "value": "3",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#ffff73",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำ",
       "value": "2",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#d1ff73",
         "a": 1.0
        }
       }
      },
      {
       "label": "ต่ำมาก",
       "value": "1",
       "symbol": {
        "kind": "polygon",
        "stroke": {
         "hex": "#000000",
         "a": 1.0
        },
        "width": 0.7,
        "fill": {
         "hex": "#38a800",
         "a": 1.0
        }
       }
      }
     ]
    },
    "geom": "polygon",
    "id": "Building_Nan_Intersect"
   }
  ]
 },
 {
  "name": "ปัจจัยที่ใช้ประเมินพื้นที่อ่อนไหวต่อแผ่นดินถล่ม",
  "layers": [
   {
    "name": "รอยเลื่อน (Lineament)",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\Nan_fault-20261105T104643Z-1-001\\Nan_fault",
     "factory": "Shapefile",
     "dataset": "26 fault.shp"
    },
    "joined": false,
    "fields": [],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "line",
      "stroke": {
       "hex": "#730000",
       "a": 1.0
      },
      "width": 1
     }
    },
    "geom": "line",
    "id": "Fault_Nan"
   },
   {
    "name": "ทางน้ำ (Drainage)",
    "type": "vector",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Stream_Nan"
    },
    "joined": false,
    "fields": [],
    "render": {
     "kind": "simple",
     "symbol": {
      "kind": "line",
      "stroke": {
       "hex": "#73dfff",
       "a": 1.0
      },
      "width": 0.7
     }
    },
    "geom": "line",
    "id": "Stream_Nan"
   },
   {
    "name": "ปริมาณน้ำฝน (Annual Precipitation)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "annual_prec_Nan"
    },
    "legend": {
     "kind": "stretch",
     "min": 1035,
     "max": 1326,
     "mean": 1176.930594522378,
     "stddev": 66.42246464653954,
     "stretchType": "MinimumMaximum",
     "invert": true,
     "stops": [
      [
       0.0,
       "#bee8ff"
      ],
      [
       0.25,
       "#73b2ff"
      ],
      [
       0.5,
       "#0070ff"
      ],
      [
       0.75,
       "#005ce6"
      ],
      [
       1,
       "#004da8"
      ]
     ],
     "heading": "สัญลักษณ์ (หน่วย: มิลลิเมตร)"
    },
    "id": "annual_prec_Nan"
   },
   {
    "name": "หน่วยหิน (Lithology / Rockunit)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Rock_Geology_Nan_Raster"
    },
    "legend": {
     "kind": "classes",
     "heading": "สัญลักษณ์",
     "field": "ROCKUNIT_D",
     "classes": [
      {
       "label": "Conglomerate, red; sandstone, brownish red; interbedded with shale, and mudstone",
       "values": [
        "Conglomerate, red; sandstone, brownish red; interbedded with shale, and mudstone"
       ],
       "color": "#70ad94"
      },
      {
       "label": "Phyllite , sandstone , siltstone , shale chert , conglomerate , and limestone.",
       "values": [
        "Phyllite , sandstone , siltstone , shale chert , conglomerate , and limestone."
       ],
       "color": "#e45df9"
      },
      {
       "label": "Phra Wihan Formation: quartzitic sandstone, white to gray, cross-bedded,thick-bedded; siltstone and  claystone",
       "values": [
        "Phra Wihan Formation: quartzitic sandstone, white to gray, cross-bedded,thick-bedded; siltstone and  claystone"
       ],
       "color": "#fb6e56"
      },
      {
       "label": "Fluvial deposits; gravel, sand, and clay of channel, river bank, and flood basin",
       "values": [
        "Fluvial deposits; gravel, sand, and clay of channel, river bank, and flood basin"
       ],
       "color": "#4d66b3"
      },
      {
       "label": "Sandstone , tuffaceous sanstone , argillaceous limestone, metarhyolitic to metaandesitic tuffs; shale , metalimestone lens, chert , shale , and oncolitic limestone",
       "values": [
        "Sandstone , tuffaceous sanstone , argillaceous limestone, metarhyolitic to metaandesitic tuffs; shale , metalimestone lens, chert , shale , and oncolitic limestone"
       ],
       "color": "#dddb4b"
      },
      {
       "label": "Phyllite , carbonaceous phyllite , and quartzitic phyllite.",
       "values": [
        "Phyllite , carbonaceous phyllite , and quartzitic phyllite."
       ],
       "color": "#57e06a"
      },
      {
       "label": "Sao Khua Formation: siltstone and sandstone, reddish brown, purple and red, calcareous, with abundant calcrete horizons",
       "values": [
        "Sao Khua Formation: siltstone and sandstone, reddish brown, purple and red, calcareous, with abundant calcrete horizons"
       ],
       "color": "#893858"
      },
      {
       "label": "Pyroxenite , peridotite serpentinite and hornblendite.",
       "values": [
        "Pyroxenite , peridotite serpentinite and hornblendite."
       ],
       "color": "#9b7639"
      },
      {
       "label": "Conglomerate , sandstone , shale , slate ,chert , and limestone",
       "values": [
        "Conglomerate , sandstone , shale , slate ,chert , and limestone"
       ],
       "color": "#fb8dd0"
      },
      {
       "label": "Sandstone and mudstone, red",
       "values": [
        "Sandstone and mudstone, red"
       ],
       "color": "#85c7fa"
      },
      {
       "label": "Kang Pla Fomation : limestone, gray , thin-bedded to massive",
       "values": [
        "Kang Pla Fomation : limestone, gray , thin-bedded to massive"
       ],
       "color": "#5b59f5"
      },
      {
       "label": "Arkosic sandstone, white; conglomerate and intercalcated shale",
       "values": [
        "Arkosic sandstone, white; conglomerate and intercalcated shale"
       ],
       "color": "#8d3394"
      },
      {
       "label": "Mae Moh Group: semi-consolidated claystone, red;siltstone, lignite, calcareous, and mudstone",
       "values": [
        "Mae Moh Group: semi-consolidated claystone, red;siltstone, lignite, calcareous, and mudstone"
       ],
       "color": "#da8c8a"
      },
      {
       "label": "Limestone , light gray , massive-to thick-bedded; and shale",
       "values": [
        "Limestone , light gray , massive-to thick-bedded; and shale"
       ],
       "color": "#bfe092"
      },
      {
       "label": "Biotite granite , tourmaline granite , granodiorite , biotite-muscovite granite , muscovite-tourmaline granite , biotite-tourmaline granite",
       "values": [
        "Biotite granite , tourmaline granite , granodiorite , biotite-muscovite granite , muscovite-tourmaline granite , biotite-tourmaline granite"
       ],
       "color": "#3f903c"
      },
      {
       "label": "Rhyolite, and rhyolitic and andesitic tuff",
       "values": [
        "Rhyolite, and rhyolitic and andesitic tuff"
       ],
       "color": "#92f5f2"
      },
      {
       "label": "Conglomerate, red; arenite, siltstone, shale, and mudstone",
       "values": [
        "Conglomerate, red; arenite, siltstone, shale, and mudstone"
       ],
       "color": "#3b7d9f"
      },
      {
       "label": "Pha Daeng Formation: sandstone ,siltstone , mudstone , and conglomerate , red.",
       "values": [
        "Pha Daeng Formation: sandstone ,siltstone , mudstone , and conglomerate , red."
       ],
       "color": "#eac28b"
      },
      {
       "label": "Terrace deposite ; gravel, sand, and laterite of rejuvenated river",
       "values": [
        "Terrace deposite ; gravel, sand, and laterite of rejuvenated river"
       ],
       "color": "#b694fc"
      },
      {
       "label": "Wang Chin Formation: mudstone , dark gray ; and intercalated sandstone , thin to thick bedded.",
       "values": [
        "Wang Chin Formation: mudstone , dark gray ; and intercalated sandstone , thin to thick bedded."
       ],
       "color": "#a76fad"
      },
      {
       "label": "Sandstone , argillaceous limestone , shale , and chert",
       "values": [
        "Sandstone , argillaceous limestone , shale , and chert"
       ],
       "color": "#76f8c4"
      }
     ]
    },
    "id": "Rock_Geology_Nan_Raster"
   },
   {
    "name": "มุมความชัน (Slope angle)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Slope_Nan"
    },
    "legend": {
     "kind": "classes",
     "heading": "สัญลักษณ์ (หน่วย: องศา)",
     "classes": [
      {
       "label": "≤1.72",
       "upper": 1.72,
       "color": "#ffffff"
      },
      {
       "label": "≤3.43",
       "upper": 3.43,
       "color": "#f4f4e4"
      },
      {
       "label": "≤5.71",
       "upper": 5.71,
       "color": "#e9e9c9"
      },
      {
       "label": "≤8.53",
       "upper": 8.53,
       "color": "#dedeae"
      },
      {
       "label": "≤11.3",
       "upper": 11.3,
       "color": "#d7d19e"
      },
      {
       "label": "≤14.04",
       "upper": 14.04,
       "color": "#d7c19e"
      },
      {
       "label": "≤16.7",
       "upper": 16.7,
       "color": "#d7b29e"
      },
      {
       "label": "≤21.8",
       "upper": 21.8,
       "color": "#d29c82"
      },
      {
       "label": "≤30.96",
       "upper": 30.96,
       "color": "#c98564"
      },
      {
       "label": "≤45",
       "upper": 45,
       "color": "#a96454"
      },
      {
       "label": "≤90",
       "upper": 90,
       "color": "#894444"
      }
     ]
    },
    "id": "Slope_Nan"
   },
   {
    "name": "ระยะห่างจากรอยเลื่อน (Distance to Lineament)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "EucDist_Fault_Nan"
    },
    "legend": {
     "kind": "stretch",
     "min": 0,
     "max": 67181.03125,
     "mean": 20991.48334942758,
     "stddev": 14073.148819089309,
     "stretchType": "PercentMinimumMaximum",
     "invert": true,
     "stops": [
      [
       0.0,
       "#a80000"
      ],
      [
       0.2124,
       "#e52409"
      ],
      [
       0.3896,
       "#ffd7d6"
      ],
      [
       0.6386,
       "#ffebea"
      ],
      [
       1,
       "#ffffff"
      ]
     ],
     "heading": "สัญลักษณ์ (หน่วย: เมตร)"
    },
    "id": "EucDist_Fault_Nan"
   },
   {
    "name": "การใช้ประโยชน์ที่ดิน (Landuse)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "LU_NAN_2567_Polygon"
    },
    "legend": {
     "kind": "classes",
     "heading": "สัญลักษณ์ (Level 1)",
     "field": "LUL1_CODE",
     "classes": [
      {
       "label": "พื้นที่เกษตรกรรม",
       "values": [
        "A"
       ],
       "color": "#aaff00"
      },
      {
       "label": "พื้นที่ป่าไม้",
       "values": [
        "F"
       ],
       "color": "#267300"
      },
      {
       "label": "พื้นที่เบ็ดเตล็ด",
       "values": [
        "M"
       ],
       "color": "#cccccc"
      },
      {
       "label": "พื้นที่ชุมชนและสิ่งปลูกสร้าง",
       "values": [
        "U"
       ],
       "color": "#ff0000"
      },
      {
       "label": "พื้นที่น้ำ",
       "values": [
        "W"
       ],
       "color": "#0070ff"
      }
     ]
    },
    "id": "LU_NAN_2567_Raster"
   },
   {
    "name": "เนื้อดิน (Soil Texture)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Soil_NAN_Polygon"
    },
    "legend": {
     "kind": "classes",
     "heading": "สัญลักษณ์",
     "field": "texture_to",
     "classes": [
      {
       "label": "ดินร่วนปนดินเหนียว",
       "values": [
        "ดินร่วนปนดินเหนียว"
       ],
       "color": "#a900e6"
      },
      {
       "label": "ดินร่วนปนทราย",
       "values": [
        "ดินร่วนปนทราย"
       ],
       "color": "#a7f65f"
      },
      {
       "label": "ดินร่วนปนทรายปนกรวด",
       "values": [
        "ดินร่วนปนทรายปนกรวด"
       ],
       "color": "#e6e600"
      },
      {
       "label": "ดินร่วนปนทรายแป้ง",
       "values": [
        "ดินร่วนปนทรายแป้ง"
       ],
       "color": "#71faf3"
      },
      {
       "label": "ดินร่วนเหนียวปนทรายแป้ง",
       "values": [
        "ดินร่วนเหนียวปนทรายแป้ง"
       ],
       "color": "#f53694"
      },
      {
       "label": "ดินร่วน",
       "values": [
        "ดินร่วน"
       ],
       "color": "#e86b23"
      },
      {
       "label": "ไม่ใช่ดิน",
       "values": [
        " "
       ],
       "color": "#cccccc"
      },
      {
       "label": "ดินร่วนเหนียวปนกรวด",
       "values": [
        "ดินร่วนเหนียวปนกรวด"
       ],
       "color": "#0084a8"
      }
     ]
    },
    "id": "Soil_NAN_Raster"
   },
   {
    "name": "ดัชนีพืชพรรณ (NDVI)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "Raster",
     "dataset": "Composite_Nan"
    },
    "legend": {
     "kind": "stretch",
     "min": -0.2701849341392517,
     "max": 0.671276867389679,
     "mean": 0.3665617298928408,
     "stddev": 0.12917234526507376,
     "stretchType": "MinimumMaximum",
     "invert": true,
     "stops": [
      [
       0.0,
       "#ff3e0d"
      ],
      [
       0.5,
       "#f2ff2a"
      ],
      [
       1,
       "#00730b"
      ]
     ],
     "heading": "สัญลักษณ์"
    },
    "id": "NDVI_Composite_Nan"
   },
   {
    "name": "ระดับความสูง (Elevation)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "DEM_Nan"
    },
    "legend": {
     "kind": "stretch",
     "min": 96,
     "max": 2060,
     "mean": 590.9264620352295,
     "stddev": 316.7797181969203,
     "stretchType": "MinimumMaximum",
     "invert": false,
     "stops": [
      [
       0,
       "#709959"
      ],
      [
       0.25,
       "#f2eea2"
      ],
      [
       0.5,
       "#f2ce85"
      ],
      [
       0.75,
       "#c28c7c"
      ],
      [
       1.0,
       "#fff5ff"
      ]
     ],
     "heading": "สัญลักษณ์ (หน่วย: เมตร)"
    },
    "id": "Elevation_Nan"
   },
   {
    "name": "ทิศทางความชัน (Slope Aspect)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "Aspect_Nan"
    },
    "legend": {
     "kind": "classes",
     "heading": "สัญลักษณ์",
     "classes": [
      {
       "label": "Flat (-1)",
       "upper": -1,
       "color": "#bdbebe"
      },
      {
       "label": "North (0 - 22.5)",
       "upper": 22.5,
       "color": "#ff2b18"
      },
      {
       "label": "Northeast (22.5 - 67.5)",
       "upper": 67.5,
       "color": "#fab721"
      },
      {
       "label": "East (67.5 - 112.5)",
       "upper": 112.5,
       "color": "#f2fe2a"
      },
      {
       "label": "Southeast (112.5 - 157.5)",
       "upper": 157.5,
       "color": "#00fc22"
      },
      {
       "label": "South (157.5 - 202.5)",
       "upper": 202.5,
       "color": "#08fcfd"
      },
      {
       "label": "Southwest (202.5 - 247.5)",
       "upper": 247.5,
       "color": "#33b3fd"
      },
      {
       "label": "West (247.5 - 292.5)",
       "upper": 292.5,
       "color": "#5813fc"
      },
      {
       "label": "Northwest (292.5 - 337.5)",
       "upper": 337.5,
       "color": "#ff27fc"
      },
      {
       "label": "North (337.5 - 360)",
       "upper": 360,
       "color": "#ff2b18"
      }
     ]
    },
    "id": "Aspect_Nan"
   },
   {
    "name": "ระยะห่างจากทางน้ำ (Distance to Drainage)",
    "type": "raster",
    "src": {
     "workspace": ".\\FinalProject_Landslide_Nan\\FinalProject_Landslide_Nan.gdb",
     "factory": "FileGDB",
     "dataset": "EucDist_Stream_Nan"
    },
    "legend": {
     "kind": "stretch",
     "min": 0,
     "max": 48456.69921875,
     "mean": 3874.788427041787,
     "stddev": 7317.9330540913425,
     "stretchType": "PercentMinimumMaximum",
     "invert": true,
     "stops": [
      [
       0.0,
       "#081d58"
      ],
      [
       0.125,
       "#253494"
      ],
      [
       0.25,
       "#225ea8"
      ],
      [
       0.375,
       "#1d91c0"
      ],
      [
       0.5,
       "#41b6c4"
      ],
      [
       0.625,
       "#7fcdbb"
      ],
      [
       0.75,
       "#c7e9b4"
      ],
      [
       0.875,
       "#edf8b1"
      ],
      [
       1,
       "#ffffd9"
      ]
     ],
     "heading": "สัญลักษณ์ (หน่วย: เมตร)"
    },
    "id": "EucDist_Stream_Nan"
   }
  ]
 }
];
