// Compact browser-safe enum map for common Roblox geometry/material values.
const values = {
 parttype:{0:"Ball",1:"Block",2:"Cylinder"},
 material:{256:"Plastic",272:"SmoothPlastic",288:"Neon",512:"Wood",528:"WoodPlanks",784:"Marble",800:"Slate",816:"Concrete",832:"Granite",848:"Brick",864:"Pebble",880:"Sand",896:"Fabric",1280:"Grass",1296:"Asphalt",1312:"Rock",1344:"Sandstone",1360:"Mud",1376:"Basalt",1392:"Limestone",1408:"Pavement",1424:"Cobblestone",1536:"Ice",1552:"Snow",1568:"Glacier",1584:"Salt",1600:"Lava",1616:"Foil",1632:"DiamondPlate",1648:"CorrodedMetal",1664:"Metal"},
};
export function getEnumName(propName,className) {
 const p=String(propName).toLowerCase(), c=String(className).toLowerCase();
 if(p==="shape" && (c==="part"||c==="basepart")) return "PartType";
 if(p==="material"||p==="materialvariant") return "Material";
 if(["top","bottom","left","right","front","back"].includes(p)) return "SurfaceType";
 if(p==="formfactor") return "FormFactor";
 if(p==="collisionfidelity") return "CollisionFidelity";
 if(p==="renderfidelity") return "RenderFidelity";
 return undefined;
}
export function getEnumValue(enumName,value) {
 const table=values[String(enumName).toLowerCase()];
 return table ? (table[value] ?? String(value)) : String(value);
}
