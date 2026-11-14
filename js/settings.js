/* =====================================================================
   ค่าตั้งของแผนที่ แก้ตัวเลขและรายการในไฟล์นี้เพื่อปรับพฤติกรรมของเว็บ
   ===================================================================== */
window.SETTINGS = {

  /* ขอบเขตเริ่มต้นของแผนที่: [ตะวันตก, ใต้], [ตะวันออก, เหนือ] */
  bounds: [[100.30, 18.00], [101.40, 19.66]],
  minZoom: 6,
  maxZoom: 17,

  /* แผนที่ฐาน (ใช้ Esri World Imagery อย่างเดียว) */
  esriUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  backgroundColor: '#12181c',          /* สีพื้นเมื่อภาพดาวเทียมยังไม่ขึ้น */

  /* มุมมอง 3 มิติ */
  pitch3D: 60,                          /* มุมเอียง (องศา) เมื่อเปิด 3 มิติ */
  terrainExaggeration: 1.5,             /* ตัวคูณความสูงของภูมิประเทศ */

  /* ระดับความอ่อนไหว: เลข ชื่อ และสีที่ใช้ในตารางสรุป */
  levels: [
    { n: 5, name: 'สูงมาก', color: '#a80000' },
    { n: 4, name: 'สูง', color: '#ff5500' },
    { n: 3, name: 'ปานกลาง', color: '#ffff73' },
    { n: 2, name: 'ต่ำ', color: '#d1ff73' },
    { n: 1, name: 'ต่ำมาก', color: '#38a800' }
  ],

  /* ชั้นข้อมูลของแบบจำลองทั้งสอง */
  studyLayer: 'Reclass_WLC1_Polygon',
  dmrLayer: 'LANDSLIDE_SUSCEPTIBILITY_Nan',

  /* ชั้นข้อมูลที่เปิดไว้ตอนเข้าเว็บ */
  defaultVisible: [
    'Nan_Province', 'Nan_Amphoe', 'Nan_Tambon',
    'Reclass_WLC1_Polygon', 'LANDSLIDE_INVENTORY_Nan',
    'health_facilitie_SpatialJoin', 'Shelter_SpatialJoin', 'village_Nan_Intersect'
  ],

  /* ลำดับการวาด จากล่างสุดไปบนสุด (ชั้นราสเตอร์ทั้งหมดอยู่ที่ตำแหน่ง '*rasters*') */
  drawOrder: [
    'Reclass_WLC1_Polygon', 'LANDSLIDE_SUSCEPTIBILITY_Nan', '*rasters*',
    'Stream_Nan', 'Fault_Nan', 'road_Nan_main_PairwiseInters',
    'Nan_Tambon', 'Nan_Amphoe', 'Nan_Province',
    'Pop_Nan_point', 'Building_Nan_Intersect',
    'LANDSLIDE_INVENTORY_Nan', 'village_Nan_Intersect',
    'Shelter_SpatialJoin', 'health_facilitie_SpatialJoin'
  ],

  /* ความทึบ (0 ถึง 1) */
  susceptibilityOpacity: 0.6,           /* พื้นที่อ่อนไหว ให้เห็นภาพดาวเทียมข้างใต้ */
  rasterOpacity: 0.8,                   /* ค่าเริ่มต้นของชั้นราสเตอร์ */

  /* แถวในตารางสรุป: key ของสถิติ, ชั้นข้อมูลต้นทาง, จำนวนทศนิยมในหน้าภาพรวม */
  summaryRows: [
    { key: 'area', layer: null, decimals: 1 },
    { key: 'village', layer: 'village_Nan_Intersect', decimals: 0 },
    { key: 'pop', layer: 'Pop_Nan_point', decimals: 0 },
    { key: 'bld', layer: 'Building_Nan_Intersect', decimals: 0 },
    { key: 'road', layer: 'road_Nan_main_PairwiseInters', decimals: 1 },
    { key: 'health', layer: 'health_facilitie_SpatialJoin', decimals: 0 },
    { key: 'shelter', layer: 'Shelter_SpatialJoin', decimals: 0 }
  ],
  inventoryLayer: 'LANDSLIDE_INVENTORY_Nan',

  /* ชั้นจุดจำนวนมากที่เก็บแบบบีบอัด (แสดงเป็นจุด) */
  denseLayers: ['Pop_Nan_point', 'Building_Nan_Intersect'],

  /* 1 ไร่ = 1,600 ตารางเมตร */
  sqmPerRai: 1600
};
