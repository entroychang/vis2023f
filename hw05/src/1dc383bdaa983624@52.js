function _1(md){return(
md`# HW5`
)}

function _data(FileAttachment){return(
FileAttachment("files/f2564cfa41b0bc5c2097fd52c9b01237a981e5a81f4b1f0ab129f86c61216f8de0d6da4df3b10dd28515247c3dd9f0a0a3e5a2236e962adc35e70199b0f11df6.json").json()
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended); 
}
)}

function _4(md){return(
md`## Simple baseline (3pt)
- 實作 Force-directed tree 呈現小組情況 (1pt)
- 使節點可以被拖拉移動 (1pt)
- 將個人圖片放入節點圓圈中 (1pt)`
)}

function _simple(d3,data,drag,invalidation)
{
  const width = 1200;
  const height = 900;
  
  // 根節點
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();
  
  // 力學模擬器
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  // link 的線
  const link = svg.append("g")
    .attr("stroke", "#00f")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  
  // link 的力
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000)
    .strength(1);
  
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  // 加入節點
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(drag(simulation));
  
  // 節點背景
  const circleRadius = 25;
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "white");
  
  // 裁剪圖片
  node.append("clipPath")
    .attr("id", (d, i) => `clip${i}`)
    .append("circle")
    .attr("r", circleRadius);
  
  // 節點圖片
  node.append("image")
    .attr("xlink:href", d => d.data.image_url)
    .attr("x", -circleRadius)
    .attr("y", -circleRadius)
    .attr("width", circleRadius * 2)
    .attr("height", circleRadius * 2)
    .attr("clip-path", (d, i) => `url(#clip${i})`);
  
  // 節點的框
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "transparent")
    .attr("stroke", d => colorScale(d.depth))
    .attr("stroke-width", 3);
  
  // 將所有節點的 Y 座標設為 0
  nodes.forEach(node => {
    node.y = 0;
  });
  
  // 設定 Y 軸方向的力
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 100));
  
  // "tick" 事件
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  });
  
  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _6(md){return(
md`## Medium baseline (5pt)
- 滑鼠移動過去顯示該成員相關資訊 (1pt)
- 滑鼠移動過去放大節點及圖片 (2pt)
- 點擊節點可以展開或縮放 (2pt)`
)}

function _medium(d3,data,drag,invalidation)
{
  const width = 1200;
  const height = 900;
  
  // 根節點
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();
  
  // 力學模擬器
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  // link 的線
  const link = svg.append("g")
    .attr("stroke", "#00f")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  
  // link 的力
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000)
    .strength(1);
  
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  // 加入節點
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(drag(simulation))
    .on("click", toggleNode)
    .on("mouseenter", (event, d) => {
      if (d.data.leval === 2 || d.data.leval === 3) {
        const enlargement = 4; // 放大倍數
        const newWidth = circleRadius * 2 * enlargement;
        const newHeight = circleRadius * 2 * enlargement;
    
        // 更新圖片
        d3.select(event.currentTarget)
          .selectAll("circle")
          .attr("r", circleRadius * enlargement);
        d3.select(event.currentTarget)
          .select("image")
          .attr("x", -(circleRadius * enlargement))
          .attr("y", -(circleRadius * enlargement))
          .attr("width", newWidth)
          .attr("height", newHeight)
      }
    })
    .on("mouseleave", (event, d) => {
      // 在移出時恢復原始大小
      d3.select(event.currentTarget)
        .selectAll("circle")
        .attr("r", circleRadius);
    
      d3.select(event.currentTarget)
        .select("image")
        .attr("width", circleRadius * 2)
        .attr("height", circleRadius * 2)
        .attr("x", -circleRadius)
        .attr("y", -circleRadius);
    });

  // 節點背景
  const circleRadius = 25;
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "white");

  // 裁剪圖片
  node.append("clipPath")
  .attr("id", (d, i) => `clipCircle-${i}`)
  .append("circle")
  .attr("r", circleRadius);
  
  // 節點圖片
  node.append("image")
    .attr("xlink:href", d => d.data.image_url)
    .attr("x", -circleRadius)
    .attr("y", -circleRadius)
    .attr("width", circleRadius * 2)
    .attr("height", circleRadius * 2)
    .attr("clip-path", (d, i) => `url(#clipCircle-${i})`);
  
  // 節點的框
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "transparent")
    .attr("stroke", d => colorScale(d.depth))
    .attr("stroke-width", 3);

  // 顯示資訊
  node.append("title")
        .text(d => {
        if (d.data.leval == 1) { // 如果沒有子節點，顯示父節點的資訊
          return d.data.Name;
        } else if(d.data.leval == 2){
          return  "組別 : " + d.data.Group +
                  "\n組長 : " + d.data.Teamleadername +
                  "\n隊名 : " + d.data.Teamname +
                  "\n團隊里程數 : " + d.data.Team_Mileage;
        }else if(d.data.leval == 3){ // 如果有子節點，顯示子節點的資訊
          return  "系所 : " + d.data.Department +
                  "\n學號 : " + d.data.Classnumber +
                  "\n姓名 : " + d.data.Name +
                  "\n個人里程數 : " + d.data.Personal_Mileage +
                  "\n作業 1 成績 : " + d.data.Hw1_score +
                  " 分\n作業 2 成績 : " + d.data.Hw2_score +
                  " 分\n作業 3 成績 : " + d.data.Hw3_score +
                  " 分\n作業 4 成績 : " + d.data.Hw4_score +
                  " 分\n作業 5 成績 : " + d.data.Hw5_score +
                  " 分\n作業 6 成績 : " + d.data.Hw6_score +
                  " 分\n作業 7 成績 : " + d.data.Hw7_score +
                  " 分\n作業 8 成績 : " + d.data.Hw8_score +
                  " 分\n作業 9 成績 : " + d.data.Hw9_score +
                  " 分\n作業 10 成績 : " + d.data.Hw10_score + " 分";
        }
      }
  );
  
  // 將所有節點的 Y 座標設為 0
  nodes.forEach(node => {
    node.y = 0;
  });
  
  // 設定 Y 軸方向的力
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 100));
  
  // "tick" 事件
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  });
  
  // 點擊節點展開或縮放
  function toggleNode(event, d) {
    if (d.data.leval == 1) {
      // 切換其他節點和連接的顯示
      var trans = true;
      nodes.forEach(node => {
        if (node.data.leval == 2) {
          node.collapsed = !node.collapsed;
          trans = node.collapsed;
        }else if(node.data.leval == 3 && trans) {
          node.collapsed = trans;
        }
      });
    }else if (d.data.leval == 2) {
      // 切換其他節點和連接的顯示
      var G = d.data.Group;
      nodes.forEach(node => {
        if (node.data.leval > 2 && node.data.Group == G) {
          node.collapsed = !node.collapsed;
        }
      });
    } 
    update();
  }
  
  function update() {
     node.attr("transform", d => `translate(${d.x},${d.y})`);
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    // 更新節點顯示
    node.style("display", d => d.collapsed ? "none" : null);
    link.style("display", d => d.target.collapsed ? "none" : null);
  }
  
  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _8(md){return(
md`## Strong baseline (2pt)
- 利用蘋果成績圖環繞個人照片(小組) (2pt)`
)}

function _url_list(){return(
[
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/01.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/11.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/12.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/21.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/22.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/31.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/32.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/41.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/42.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/51.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/52.svg"
]
)}

function _data_random_score(data){return(
JSON.parse(JSON.stringify(data))
)}

function _11(data_random_score)
{
  data_random_score.children = data_random_score.children.filter((item, index) => index === 12);
  
  data_random_score.children.forEach(item => {
  if (item.children) {
    item.children.forEach(subItem => {
      for (let i = 1; i <= 10; i++) {
        let key = `Hw${i}_score`;
        subItem[key] = generateRandomScore();
      }
    });
  }

  function generateRandomScore() {
    return Math.floor(Math.random() * 11);
  }
  });
  
  return data_random_score;
}


function _strong(d3,data_random_score,drag,url_list,invalidation)
{
  const width = 1200;
  const height = 500;
  
  // 根節點
  const root = d3.hierarchy(data_random_score);
  const links = root.links();
  const nodes = root.descendants();
  
  // 力學模擬器
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  // link 的線
  const link = svg.append("g")
    .attr("stroke", "#00f")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  
  // link 的力
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000)
    .strength(1);
  
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  // 加入節點
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(drag(simulation))
    .on("click", toggleNode);
  
  // 節點背景
  const circleRadius = 25;
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "white");

  // 在節點外框周圍添加多個圖片
  const numImages = 10; // 圖片的數量
  const imageRadius = circleRadius + 10; // 圖片環繞外框的半徑
  const imageWidth = 20; // 圖片的寬度
  const imageHeight = 20; // 圖片的高度
  const imagesGroup = node.append("g"); // 新增一個 <g> 元素用於包裝圖片
  
  for (let i = 0; i < numImages; i++) {
      const angle = ((i / numImages) * 2 * Math.PI); // 逆時鐘排列，角度方向不變
      const x = imageRadius * Math.sin(angle); // 調整 x 座標的計算
      const y = -imageRadius * Math.cos(angle); // 調整 y 座標的計算
      imagesGroup.append("image")
          .attr("xlink:href", d => {
              if (d.data.leval == 3) { // 如果有子節點，顯示子節點的資訊
                  const score = parseInt(d.data[`Hw${i + 1}_score`]);
                  return url_list[score];
              }
          })
          .attr("x", x - imageWidth / 2) // 調整 x 位置，使圖片居中
          .attr("y", y - imageHeight / 2) // 調整 y 位置，使圖片居中
          .attr("width", imageWidth)
          .attr("height", imageHeight);
  }
  
  // 裁剪圖片
  node.append("clipPath")
    .attr("id", (d, i) => `clip${i}`)
    .append("circle")
    .attr("r", circleRadius);
  
  // 節點圖片
  node.append("image")
    .attr("xlink:href", d => d.data.image_url)
    .attr("x", -circleRadius)
    .attr("y", -circleRadius)
    .attr("width", circleRadius * 2)
    .attr("height", circleRadius * 2)
    .attr("clip-path", (d, i) => `url(#clip${i})`);
  
  // 節點的框
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", "transparent")
    .attr("stroke", d => colorScale(d.depth))
    .attr("stroke-width", 3);

  // 顯示資訊
  node.append("title")
        .text(d => {
        if (d.data.leval == 1) { // 如果沒有子節點，顯示父節點的資訊
          return d.data.Name;
        } else if(d.data.leval == 2){
          return  "組別 : " + d.data.Group +
                  "\n組長 : " + d.data.Teamleadername +
                  "\n隊名 : " + d.data.Teamname +
                  "\n團隊里程數 : " + d.data.Team_Mileage;
        }else if(d.data.leval == 3){ // 如果有子節點，顯示子節點的資訊
          return  "系所 : " + d.data.Department +
                  "\n學號 : " + d.data.Classnumber +
                  "\n姓名 : " + d.data.Name +
                  "\n個人里程數 : " + d.data.Personal_Mileage +
                  "\n作業 1 成績 : " + d.data.Hw1_score +
                  " 分\n作業 2 成績 : " + d.data.Hw2_score +
                  " 分\n作業 3 成績 : " + d.data.Hw3_score +
                  " 分\n作業 4 成績 : " + d.data.Hw4_score +
                  " 分\n作業 5 成績 : " + d.data.Hw5_score +
                  " 分\n作業 6 成績 : " + d.data.Hw6_score +
                  " 分\n作業 7 成績 : " + d.data.Hw7_score +
                  " 分\n作業 8 成績 : " + d.data.Hw8_score +
                  " 分\n作業 9 成績 : " + d.data.Hw9_score +
                  " 分\n作業 10 成績 : " + d.data.Hw10_score + " 分";
        }
      }
  );
  
  // 將所有節點的 Y 座標設為 0
  nodes.forEach(node => {
    node.y = 0;
  });
  
  // 設定 Y 軸方向的力
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 100));
  
  // "tick" 事件
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  });

  // 點擊節點展開或縮放
  function toggleNode(event, d) {
    if (d.data.leval == 1) {
      // 切換其他節點和連接的顯示
      var trans = true;
      nodes.forEach(node => {
        if (node.data.leval == 2) {
          node.collapsed = !node.collapsed;
          trans = node.collapsed;
        }else if(node.data.leval == 3 && trans) {
          node.collapsed = trans;
        }
      });
    }else if (d.data.leval == 2) {
      // 切換其他節點和連接的顯示
      var G = d.data.Group;
      nodes.forEach(node => {
        if (node.data.leval > 2 && node.data.Group == G) {
          node.collapsed = !node.collapsed;
        }
      });
    } 
    update();
  }
  
  function update() {
     node.attr("transform", d => `translate(${d.x},${d.y})`);
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    // 更新節點顯示
    node.style("display", d => d.collapsed ? "none" : null);
    link.style("display", d => d.target.collapsed ? "none" : null);
  }
  
  invalidation.then(() => simulation.stop());

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("./files/f2564cfa41b0bc5c2097fd52c9b01237a981e5a81f4b1f0ab129f86c61216f8de0d6da4df3b10dd28515247c3dd9f0a0a3e5a2236e962adc35e70199b0f11df6.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("simple")).define("simple", ["d3","data","drag","invalidation"], _simple);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("medium")).define("medium", ["d3","data","drag","invalidation"], _medium);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("url_list")).define("url_list", _url_list);
  main.variable(observer("data_random_score")).define("data_random_score", ["data"], _data_random_score);
  main.variable(observer()).define(["data_random_score"], _11);
  main.variable(observer("strong")).define("strong", ["d3","data_random_score","drag","url_list","invalidation"], _strong);
  return main;
}
