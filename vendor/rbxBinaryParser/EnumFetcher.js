// Compact browser-safe enum map for common Roblox geometry/material values.
const values = {
 parttype:{0:"Ball",1:"Block",2:"Cylinder"},
 material:{256:"Plastic",272:"SmoothPlastic",288:"Neon",512:"Wood",528:"WoodPlanks",784:"Marble",788:"Basalt",800:"Slate",804:"CrackedLava",816:"Concrete",820:"Limestone",832:"Granite",836:"Pavement",848:"Brick",864:"Pebble",880:"Cobblestone",896:"Rock",912:"Sandstone",928:"CorrodedMetal",944:"DiamondPlate",960:"Foil",976:"Metal",1280:"Grass",1284:"LeafyGrass",1296:"Sand",1312:"Fabric",1328:"Snow",1344:"Mud",1360:"Ground",1376:"Asphalt",1392:"Salt",1536:"Ice",1552:"Glacier",1568:"Glass"},
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
