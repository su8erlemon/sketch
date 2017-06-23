const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

import LiquidSphere from './js/LiquidSphere';
import LiquidSphere2 from './js/LiquidSphere2';
import CircleBoxes from './js/CircleBoxes';
import CirclePanels from './js/CirclePanels';
import ThinLines from './js/ThinLines';
import TubeLines from './js/TubeLines';
import SkySphere from './js/SkySphere';
import DelayPass from './js/DelayPass'
import DelayPass2 from './js/DelayPass2'
import DelayPass3 from './js/DelayPass3'

let displayObjList = [];


console.log(DelayPass)


let container = new THREE.Group();
scene.add( container );

// let skySphere = new SkySphere();
// skySphere.init( container);
// displayObjList.push(skySphere);


const fog = {
    color: new THREE.Color(0xb0c8d7),
    near: 0.1,
    far: 8.0,
};
scene.fog = new THREE.Fog(fog.color,fog.near,fog.far)


// let svgBlob = new Blob([['<?xml version="1.0" encoding="UTF-8"?><svg width="602px" height="60px" viewBox="0 0 602 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Artboard" fill="#FBE400"><path d="M14.6773667,38.2384019 L0,41.2315331 L0.172409534,42.360323 C1.57692242,51.5550804 10.3023834,58.4641671 20.8142133,58.4641671 C32.2577438,58.4641671 41.6041994,50.5928173 41.6041994,40.7199783 C41.6041994,32.4552159 34.6412978,26.8896565 26.4465017,24.8247104 C21.5924058,23.593164 15.7217097,22.3704939 15.7217097,18.5788765 C15.7217097,16.1621494 18.0787392,14.1819286 20.8528166,14.1819286 C24.4807267,14.1819286 25.9259315,16.7394586 25.9259315,20.2705646 L40.6849604,17.3013821 L40.5295725,16.1840444 C39.2629733,7.07575274 31.2806869,0.0641531944 20.7754707,0.0641531944 C9.25431585,0.0641531944 0.803359509,7.98816919 0.803359509,17.7906938 C0.803359509,25.8641105 7.50641108,31.6393251 15.4880013,33.9988608 C20.5789733,35.5058169 26.7962637,36.0929074 26.7962637,39.8974042 C26.7962637,42.1117511 23.6552286,44.2941084 20.7174788,44.2941084 L19.9747567,44.2941084 L19.9636178,44.2926464 C17.213872,43.9348783 14.6773667,41.8581667 14.6773667,39.7374563 L14.6773667,38.2384019 Z M81.3297853,44.2705078 C78.1120658,44.2705078 75.4366722,43.3370667 73.1337361,41.412436 C70.8210535,39.4388986 69.7096682,37.1882806 69.7096682,34.5243392 L69.7096682,0.463378906 L55.5944338,0.463378906 L55.5944338,35.0135117 C55.5944338,41.4618998 58.0095596,47.0515122 62.769114,51.6147084 C67.5301304,56.1554875 73.8119569,58.4570312 81.3697114,58.4570312 C88.8525915,58.4570312 95.1058049,56.1542344 99.889308,51.6158223 C104.651125,47.0504332 107.065137,41.4623175 107.065137,35.0135117 L107.065137,0.463378906 L92.9499025,0.463378906 L92.9499025,34.5243392 C92.9499025,40.1330619 87.150948,44.2705078 81.3297853,44.2705078 Z M139.288343,16.7351074 C139.288343,18.2667067 141.205931,19.1767578 142.812365,19.1767578 L143.272627,19.1767578 C144.581825,19.0323114 146.2176,18.1946584 146.2176,16.7351074 C146.2176,15.2279359 144.265626,14.293457 142.772769,14.293457 C141.172149,14.293457 139.288343,15.2382998 139.288343,16.7351074 Z M161.08418,16.7217059 C161.08418,19.9277296 160.154499,22.9207563 158.378538,25.5469646 C162.090442,29.2386799 163.935743,33.6999202 163.935743,38.8609629 C163.935743,44.1223602 161.95949,48.6986098 158.081094,52.4160838 C154.118112,56.1134729 148.81321,57.9936523 142.693578,57.9936523 C136.575183,57.9936523 131.265989,56.1108274 127.305,52.4188337 C123.404256,48.7281976 121.411817,44.1447773 121.411817,38.8609629 C121.411817,33.6979012 123.31873,29.1981273 127.0259,25.5256963 C125.216836,22.8380151 124.334669,19.9173913 124.334669,16.7217059 C124.334669,12.2326531 126.041916,8.31332111 129.371199,5.1465621 C132.954995,1.97767973 137.509512,0.356410503 142.733174,0.356410503 C147.91055,0.356410503 152.451108,1.97444248 156.081624,5.14492607 C159.396356,8.32212782 161.08418,12.2333841 161.08418,16.7217059 Z M142.654022,44.0922503 C146.132676,44.0922503 149.385299,41.4944914 149.385299,38.0683246 C149.385299,36.4446187 148.74299,35.0632887 147.368004,33.774899 C146.093748,32.6370587 144.792772,32.1078906 143.246488,31.992394 L143.149162,32.0800433 L142.574868,32.0800433 C139.059957,32.0800433 135.962339,34.760519 135.962339,38.1396136 C135.962339,41.5201865 139.054918,44.0922503 142.654021,44.0922503 L142.654022,44.0922503 Z M178.282422,57.9936523 L217.919141,57.9936523 L217.919141,44.0209961 L192.998288,44.0209961 L192.998288,36.1791992 L212.144727,36.1791992 L212.144727,22.1708984 L192.998288,22.1708984 L192.998288,14.3291016 L217.919141,14.3291016 L217.919141,0.320800781 L178.282422,0.320800781 L178.282422,57.9936523 Z M245.986494,57.9223633 L231.943314,57.9223633 L231.906173,0.463378906 L252.916222,0.463378906 C256.341508,0.463378906 259.683914,0.950532436 262.916045,1.91993141 C265.728203,2.90033007 268.195369,4.40136862 270.320152,6.41347456 C273.947888,9.89024353 276.248701,13.3112483 276.248701,19.7644053 L276.248701,21.1991673 C276.248701,25.1691117 274.938764,28.9203506 272.382035,32.3796453 C270.553129,34.8335485 269.02212,36.0925941 266.330018,37.31603 L280.136426,57.9223633 L263.060085,57.9223633 L245.986494,35.4721565 L245.986494,57.9223633 Z M254.21032,27.8027344 C258.055022,27.8027344 261.640952,24.916328 261.640952,20.9590192 C261.640952,19.1882796 260.9038,17.6735263 259.392945,16.3129425 C257.897476,15.0848074 254.704645,14.4003906 252.081326,14.4003906 L245.950884,14.4003906 L245.950884,27.7670898 L251.162922,27.7670898 L251.162922,27.8027344 L254.21032,27.8027344 Z M292.700879,57.9223633 L332.337598,57.9223633 L332.337598,43.949707 L306.744824,43.949707 L306.744824,0.463378906 L292.700879,0.463378906 L292.700879,57.9223633 Z M346.327832,57.9936523 L385.964551,57.9936523 L385.964551,44.0209961 L361.043698,44.0209961 L361.043698,36.1791992 L380.190137,36.1791992 L380.190137,22.1708984 L361.043698,22.1708984 L361.043698,14.3291016 L385.964551,14.3291016 L385.964551,0.320800781 L346.327832,0.320800781 L346.327832,57.9936523 Z M399.954785,0.320800781 L399.954785,57.9223633 L413.998731,57.9223633 L413.998731,36.7068009 L430.611693,57.8733172 L447.183789,36.7134843 L447.183789,57.9223633 L461.227735,57.9223633 L461.227735,0.320800781 L458.345296,0.320800781 L430.609848,36.8416514 L402.838024,0.320800781 L399.954785,0.320800781 Z M484.145358,8.59001875 C490.434076,2.88772917 496.99817,0 505.799584,0 C514.600372,0 521.167703,2.88943481 527.452628,8.58827829 C533.407318,14.287818 536.419629,21.2238817 536.419629,29.2255917 C536.419629,37.2491269 533.407423,44.1764188 527.448694,49.832273 C521.185734,55.4639001 514.621641,58.3144531 505.797983,58.3144531 C496.952257,58.2907829 490.392062,55.4438152 484.149256,49.8304977 C478.215556,44.1492329 475.217969,37.2265706 475.217969,29.2255917 C475.217969,21.246438 478.215695,14.3148994 484.145358,8.59001875 Z M516.840861,18.5519691 C513.45101,15.5929856 510.546329,14.1508789 505.799898,14.1508789 C500.972326,14.1508789 498.061414,15.5953875 494.727676,18.5463648 C491.331142,21.5523057 489.679276,25.0362105 489.679276,29.1559038 C489.679276,33.3226242 491.332639,36.8018994 494.721236,39.759769 C498.081499,42.692924 500.996762,44.1279645 505.799898,44.1279645 C510.522102,44.1279645 513.430751,42.6953607 516.847405,39.7541299 C520.256296,36.8195825 521.920555,33.3438926 521.920555,29.1559038 C521.920555,25.0149422 520.257828,21.5345879 516.840861,18.5519691 Z M550.409863,0.320800781 L550.409863,57.9223633 L564.876774,57.9223633 L564.876774,27.7558117 L598.435718,57.9223633 L601.59541,57.9223633 L601.59541,0.320800781 L587.090001,0.320800781 L587.090001,30.5587111 L553.450613,0.320800781 L550.409863,0.320800781 Z" id="su8erlemon"></path></g></g></svg>']], {type:"image/svg+xml"});
// let reader = new FileReader();
// let dataBase64 = reader.readAsDataURL(svgBlob);
// console.log(dataBase64)
let img = new Image();
img.src = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20width%3D%2221074px%22%20height%3D%222048px%22%20viewBox%3D%220%200%2021074%202048%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20id%3D%22Page-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Artboard%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20id%3D%22Rectangle%22%20fill%3D%22%23444444%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2221074%22%20height%3D%222048%22%3E%3C/rect%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M749.097865%2C1332.09704%20L247%2C1434.48903%20L252.897956%2C1473.10379%20C300.94492%2C1787.64713%20599.434112%2C2024%20959.033175%2C2024%20C1350.50478%2C2024%201670.23756%2C1754.72909%201670.23756%2C1416.98926%20C1670.23756%2C1134.2601%201432.04375%2C943.867942%201151.70806%2C873.228223%20C985.654354%2C831.098267%20784.823782%2C789.27196%20784.823782%2C659.564566%20C784.823782%2C576.890778%20865.455374%2C509.149429%20960.353755%2C509.149429%20C1084.46089%2C509.149429%201133.89988%2C596.63994%201133.89988%2C717.435503%20L1638.79133%2C615.862774%20L1633.47566%2C577.639782%20C1590.14659%2C266.054341%201317.08065%2C26.1946159%20957.707832%2C26.1946159%20C563.580781%2C26.1946159%20274.482116%2C297.267185%20274.482116%2C632.601632%20C274.482116%2C908.785049%20503.786728%2C1106.3493%20776.828854%2C1187.06663%20C950.985853%2C1238.61807%201163.67307%2C1258.70184%201163.67307%2C1388.84983%20C1163.67307%2C1464.60039%201056.22144%2C1539.25663%20955.723985%2C1539.25663%20L930.316216%2C1539.25663%20L929.935165%2C1539.20662%20C835.869142%2C1526.96773%20749.097865%2C1455.92553%20749.097865%2C1383.37817%20L749.097865%2C1332.09704%20Z%20M3029.20966%2C1538.44928%20C2919.13473%2C1538.44928%202827.61223%2C1506.5172%202748.83111%2C1440.67753%20C2669.71658%2C1373.16481%202631.69721%2C1296.17345%202631.69721%2C1205.04271%20L2631.69721%2C39.8517235%20L2148.82933%2C39.8517235%20L2148.82933%2C1221.77681%20C2148.82933%2C1442.36964%202231.44834%2C1633.58462%202394.26788%2C1789.68695%20C2557.13743%2C1945.02241%202772.03236%2C2023.75589%203030.57549%2C2023.75589%20C3286.55725%2C2023.75589%203500.47335%2C1944.97954%203664.11215%2C1789.72505%20C3827.00909%2C1633.54771%203909.59%2C1442.38393%203909.59%2C1221.77681%20L3909.59%2C39.8517235%20L3426.72211%2C39.8517235%20L3426.72211%2C1205.04271%20C3426.72211%2C1396.91144%203228.34575%2C1538.44928%203029.20966%2C1538.44928%20Z%20M5011.91328%2C596.491091%20C5011.91328%2C648.885554%205077.51203%2C680.017481%205132.4665%2C680.017481%20L5148.21159%2C680.017481%20C5192.99793%2C675.076116%205248.95613%2C646.420854%205248.95613%2C596.491091%20C5248.95613%2C544.93228%205182.1811%2C512.964702%205131.11196%2C512.964702%20C5076.35636%2C512.964702%205011.91326%2C545.286818%205011.91328%2C596.491091%20Z%20M5757.52682%2C596.032639%20C5757.52682%2C705.707466%205725.72335%2C808.095882%205664.96952%2C897.935811%20C5791.95002%2C1024.22565%205855.07589%2C1176.84017%205855.07589%2C1353.39422%20C5855.07589%2C1533.3813%205787.47029%2C1689.93017%205654.79427%2C1817.10119%20C5519.22468%2C1943.58513%205337.74932%2C2007.90417%205128.40291%2C2007.90417%20C4919.09883%2C2007.90417%204737.47665%2C1943.49463%204601.97523%2C1817.19526%20C4468.53473%2C1690.94233%204400.37541%2C1534.14816%204400.37541%2C1353.39422%20C4400.37541%2C1176.7711%204465.60897%2C1022.83839%204592.42752%2C897.208241%20C4530.54126%2C805.265387%204500.36321%2C705.353803%204500.36321%2C596.032639%20C4500.36321%2C442.466686%204558.76643%2C308.390303%204672.65782%2C200.058682%20C4795.25584%2C91.6544224%204951.06125%2C36.1924427%205129.75744%2C36.1924427%20C5306.87027%2C36.1924427%205462.19815%2C91.5436795%205586.39441%2C200.002715%20C5699.78806%2C308.691572%205757.52682%2C442.491693%205757.52682%2C596.032639%20Z%20M5127.04973%2C1532.35127%20C5246.05099%2C1532.35127%205357.31994%2C1443.48457%205357.31994%2C1326.27886%20C5357.31994%2C1270.73353%205335.34717%2C1223.47963%205288.31031%2C1179.40512%20C5244.71928%2C1140.48076%205200.21423%2C1122.37845%205147.31742%2C1118.42743%20L5143.98797%2C1121.42582%20L5124.34198%2C1121.42582%20C5004.10043%2C1121.42582%204898.13406%2C1213.12218%204898.13406%2C1328.71759%20C4898.13406%2C1444.36357%205003.92804%2C1532.35127%205127.04971%2C1532.35127%20L5127.04973%2C1532.35127%20Z%20M6345.86126%2C2007.90417%20L7701.79331%2C2007.90417%20L7701.79331%2C1529.91373%20L6849.27614%2C1529.91373%20L6849.27614%2C1261.6538%20L7504.25644%2C1261.6538%20L7504.25644%2C782.444002%20L6849.27614%2C782.444002%20L6849.27614%2C514.184066%20L7701.79331%2C514.184066%20L7701.79331%2C34.9742701%20L6345.86126%2C34.9742701%20L6345.86126%2C2007.90417%20Z%20M8661.94904%2C2005.46544%20L8181.54608%2C2005.46544%20L8180.27552%2C39.8517235%20L8899.00804%2C39.8517235%20C9016.18362%2C39.8517235%209130.52394%2C56.5167528%209241.09186%2C89.6789109%20C9337.29296%2C123.217357%209421.69219%2C174.566367%209494.37887%2C243.398475%20C9618.48005%2C362.335224%209697.18853%2C479.364335%209697.18853%2C700.120305%20L9697.18853%2C749.202061%20C9697.18853%2C885.009845%209652.37692%2C1013.33593%209564.9138%2C1131.6749%20C9502.34879%2C1215.62045%209449.97451%2C1258.69113%209357.88043%2C1300.54363%20L9830.18368%2C2005.46544%20L9246.01932%2C2005.46544%20L8661.94904%2C1237.46658%20L8661.94904%2C2005.46544%20Z%20M8943.27784%2C975.103411%20C9074.80118%2C975.103411%209197.47223%2C876.362368%209197.47223%2C740.986839%20C9197.47223%2C680.41163%209172.25499%2C628.593451%209120.57017%2C582.049257%20C9069.41169%2C540.035997%208960.18817%2C516.622792%208870.44708%2C516.622792%20L8660.73087%2C516.622792%20L8660.73087%2C973.884047%20L8839.02942%2C973.884047%20L8839.02942%2C975.103411%20L8943.27784%2C975.103411%20Z%20M10260.0009%2C2005.46544%20L11615.9329%2C2005.46544%20L11615.9329%2C1527.47501%20L10740.4301%2C1527.47501%20L10740.4301%2C39.8517235%20L10260.0009%2C39.8517235%20L10260.0009%2C2005.46544%20Z%20M12094.5247%2C2007.90417%20L13450.4567%2C2007.90417%20L13450.4567%2C1529.91373%20L12597.9396%2C1529.91373%20L12597.9396%2C1261.6538%20L13252.9199%2C1261.6538%20L13252.9199%2C782.444002%20L12597.9396%2C782.444002%20L12597.9396%2C514.184066%20L13450.4567%2C514.184066%20L13450.4567%2C34.9742701%20L12094.5247%2C34.9742701%20L12094.5247%2C2007.90417%20Z%20M13929.0485%2C34.9742701%20L13929.0485%2C2005.46544%20L14409.4777%2C2005.46544%20L14409.4777%2C1279.70252%20L14977.7903%2C2003.78762%20L15544.7049%2C1279.93115%20L15544.7049%2C2005.46544%20L16025.1341%2C2005.46544%20L16025.1341%2C34.9742701%20L15926.5288%2C34.9742701%20L14977.7272%2C1284.31562%20L14027.6812%2C34.9742701%20L13929.0485%2C34.9742701%20Z%20M16809.1228%2C317.85585%20C17024.2535%2C122.786293%2017248.8045%2C24%2017549.892%2C24%20C17850.958%2C24%2018075.6198%2C122.844641%2018290.6207%2C317.79631%20C18494.3246%2C512.771795%2018597.3727%2C750.047518%2018597.3727%2C1023.77792%20C18597.3727%2C1298.25494%2018494.3282%2C1535.23059%2018290.4861%2C1728.71164%20C18076.2366%2C1921.3639%2017851.6856%2C2018.87844%2017549.8372%2C2018.87844%20C17247.2339%2C2018.0687%2017022.8162%2C1920.67682%2016809.2562%2C1728.65091%20C16606.2703%2C1534.30058%2016503.7259%2C1297.48331%2016503.7259%2C1023.77792%20C16503.7259%2C750.819147%2016606.275%2C513.698225%2016809.1228%2C317.85585%20Z%20M17927.6029%2C658.644089%20C17811.6395%2C557.420261%2017712.2733%2C508.087249%2017549.9027%2C508.087249%20C17384.7564%2C508.087249%2017285.177%2C557.502425%2017171.1332%2C658.452373%20C17054.9412%2C761.28257%2016998.4325%2C880.46343%2016998.4325%2C1021.39397%20C16998.4325%2C1163.93326%2017054.9924%2C1282.95574%2017170.9129%2C1384.14147%20C17285.8641%2C1484.48173%2017385.5923%2C1533.57301%2017549.9027%2C1533.57301%20C17711.4445%2C1533.57301%2017810.9465%2C1484.56509%2017927.8268%2C1383.94856%20C18044.4415%2C1283.56066%2018101.3741%2C1164.66083%2018101.3741%2C1021.39397%20C18101.3741%2C879.73586%2018044.4939%2C760.676461%2017927.6029%2C658.644089%20Z%20M19075.9645%2C34.9742701%20L19075.9645%2C2005.46544%20L19570.8629%2C2005.46544%20L19570.8629%2C973.498233%20L20718.8804%2C2005.46544%20L20826.9703%2C2005.46544%20L20826.9703%2C34.9742701%20L20330.7549%2C34.9742701%20L20330.7549%2C1069.38258%20L19179.9855%2C34.9742701%20L19075.9645%2C34.9742701%20Z%22%20id%3D%22su8erlemon%22%20fill%3D%22%23FBE400%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E";
var texture = new THREE.Texture();
texture.image = img;
img.onload = function() {
    texture.needsUpdate = true;
};


// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

// let liquidSphere = new LiquidSphere();
// liquidSphere.init( container, fog);
// displayObjList.push(liquidSphere);
//
// let liquidSphere2 = new LiquidSphere(true);
// liquidSphere2.init( container, fog);
// displayObjList.push(liquidSphere2);
// // liquidSphere2.container.position.y = -1.0;
// // liquidSphere2.container.rotation.x = -1.0;
// liquidSphere2.container.rotation.z = 3.14;
// //
// //
// let liquidSphere3 = new LiquidSphere();
// liquidSphere3.init( container, fog);
// displayObjList.push(liquidSphere3);
// liquidSphere3.container.rotation.z = 3.14 + 3.14/2;
// // liquidSphere3.container.position.x = 5.0;
// // liquidSphere3.container.rotation.y = -1.0;
//
// let liquidSphere4 = new LiquidSphere();
// liquidSphere4.init( container, fog);
// displayObjList.push(liquidSphere4);
// liquidSphere4.container.rotation.z = 3.14/2;
// // liquidSphere4.container.position.x = 5.0;
// // liquidSphere4.container.rotation.y = -1.0;
//
//
//
//
// let liquidSphere0 = new LiquidSphere2();
// liquidSphere0.init( container, fog);
// displayObjList.push(liquidSphere0);
//
// let liquidSphere02 = new LiquidSphere2(true);
// liquidSphere02.init( container, fog);
// displayObjList.push(liquidSphere02);
// liquidSphere02.container.rotation.z = 3.14;

// let liquidSphere03 = new LiquidSphere2();
// liquidSphere03.init( container, fog);
// displayObjList.push(liquidSphere03);
// liquidSphere03.container.rotation.z = 3.14 + 3.14/2;


// let liquidSphere04 = new LiquidSphere2();
// liquidSphere04.init( container, fog);
// displayObjList.push(liquidSphere04);
// liquidSphere04.container.rotation.z = 3.14/2;




// let circleBoxes = new CircleBoxes({num:40, r:1.5, size:{x:0.1, y:0.1, z:0.1 }});
// circleBoxes.init( container, fog);
// displayObjList.push(circleBoxes);
//
//
// let circleBoxes2 = new CircleBoxes({
//     num:5,
//     r:1.0,
//     size:{x:0.1, y:4., z:0.1 }
// });
// circleBoxes2.init( container, fog);
// displayObjList.push(circleBoxes2);
//
//
// let circleBoxes3 = new CircleBoxes({
//     num:30,
//     r:2.0,
//     size:{x:0.1, y:0.1, z:0.1 }
// });
// circleBoxes3.init( container, fog);
// displayObjList.push(circleBoxes3);
//
//
// let circleBoxes4 = new CircleBoxes({
//     num:10,
//     r:2.8,
//     size:{x:0.8, y:0.8, z:0.03 }
// });
// circleBoxes4.init( container, fog);
// displayObjList.push(circleBoxes4);
//
// let circlePanels = new CirclePanels(
//     1.0,
//     {x:0.1, y:1, z:0.8 }
// );
// circlePanels.init( container, fog);
// displayObjList.push(circlePanels);
//
// let circlePanels2 = new CirclePanels(
//     1.5,
//     {x:0.3, y:0.3, z:0.3 }
// );
// circlePanels2.init( container, fog);
// displayObjList.push(circlePanels2);
//
//
// let thinLines = new ThinLines();
// thinLines.init( container );
// displayObjList.push(thinLines);
//
//
// let tubeLines = new TubeLines();
// tubeLines.init( container, fog);
// displayObjList.push(tubeLines);



let canvasWidth  = 1024;
let canvasHeight = 1024;

let tex1 = new THREE.WebGLRenderTarget( canvasWidth, canvasHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
var tex1Composer = new THREE.EffectComposer( renderer, tex1 );
var delayShader = new THREE.ShaderPass( THREE.DelayShader );
// delayShader.clear = true;
// delayShader.needsSwap = false;
// delayShader.renderToScreen = true;

tex1Composer.addPass( delayShader );

let tex2 = new THREE.WebGLRenderTarget( canvasWidth, canvasHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
var tex2Composer = new THREE.EffectComposer( renderer, tex2 );
let delayShader2 = new THREE.ShaderPass( THREE.DelayShader2 );
// delayShader2.renderToScreen = true;
tex2Composer.addPass( delayShader2 );


var mainComposer = new THREE.EffectComposer( renderer );

var ren = new THREE.RenderPass( scene, camera )
mainComposer.addPass( ren );

let delayShader3 = new THREE.ShaderPass( THREE.DelayShader3 );
delayShader3.renderToScreen = true;
mainComposer.addPass( delayShader3 );

console.log(delayShader.uniforms)
console.log(delayShader2.uniforms)
console.log(delayShader3.uniforms)

// var composer = new THREE.EffectComposer( renderer, rtTexture );
// var ren = new THREE.RenderPass( scene, camera )
// ren.clear = true;

// ren.needsSwap = false;
// ren.clearColor = 0xff0000;
// ren.clearAlpha = 0.4;
// composer.addPass( ren );






// var RGBShiftShader = new THREE.ShaderPass( THREE.RGBShiftShader );
// RGBShiftShader.uniforms[ 'amount' ].value = 0.0010;
// composer.addPass( RGBShiftShader );
//
// var bloomPass = new THREE.UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     0.1,
//     20.4,
//     0.95
// );//1.0, 9, 0.5, 512);
// composer.addPass(bloomPass);

// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.renderToScreen = true;
// composer.addPass( copyShader );



// var WIDTH = $(window).width();
// var HEIGHT = $(window).height();
// var scene_bg = new THREE.Scene();
// var camera_bg = new THREE.OrthographicCamera(0, WIDTH, HEIGHT, 0, 0, 1000);
// var composer2 = new THREE.EffectComposer( renderer );
//
//
// var delayShader2 = new THREE.ShaderPass( THREE.DelayShader2 );
// // delayShader2.clear = true;
// // delayShader2.needsSwap = true;
// composer2.addPass( delayShader2 );
//
// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.renderToScreen = true;
// // copyShader.needsSwap = false;
// // copyShader.clear = true;
// composer2.addPass( copyShader );

// var guiData = {
//     enableCameraMove:false
// };
// var gui = new dat.GUI();
//
// bloomPass.threshold = guiData.bloomThreshold = 0.89;//44;
// gui.add( guiData, 'bloomThreshold', 0.0, 1.0 ).onChange( function(value) {
//     bloomPass.threshold = Number(value);
// });
// bloomPass.strength = guiData.bloomStrength = 3.;
// gui.add( guiData, 'bloomStrength', 0.0, 3.0 ).onChange( function(value) {
//     bloomPass.strength = Number(value);
// });
// bloomPass.radius = guiData.bloomRadius = 0.000;
// gui.add( guiData, 'bloomRadius', 0.0, 1.0 ).onChange( function(value) {
//     bloomPass.radius = Number(value);
// });
//
// guiData.speed = -0.011;
// gui.add( guiData, 'speed', -0.1, 0.1 );
//
// guiData.RGBShift = RGBShiftShader.uniforms[ 'amount' ].value = 0.0011;
// gui.add( guiData, 'RGBShift', 0.0, 0.01 ).onChange( function(value) {
//     RGBShiftShader.uniforms[ 'amount' ].value = value;
// });








// var composer2 = new THREE.EffectComposer( renderer );
//
// var delayShader = new THREE.ShaderPass( THREE.DelayShader );
// // delayShader.renderToScreen = true;
// delayShader.clear = false;
// composer2.addPass( delayShader );
//
// // var ren2 = new THREE.RenderPass( scene, camera )
// // // ren2.clear = false;
// // composer2.addPass( ren2 );
//
// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.clear = false;
// copyShader.renderToScreen = true;
// composer2.addPass( copyShader );


// var composer3 = new THREE.EffectComposer( renderer );
// var delayShader3 = new THREE.ShaderPass( THREE.DelayShader );
// delayShader3.uniforms[ 'tDiffusePrev' ].value = composer2.renderTarget2.texture;
// delayShader3.renderToScreen = true;
// composer3.addPass( delayShader3 );

// delayShader0.uniforms[ 'tDiffusePrev' ].value = composer2.readBuffer.texture;






// console.log(composer)

$(window).keypress((e) =>{

    rl = Math.random()*6.28;

    switch (true){
        case e.which == 97:
            console.log("A!")
            const nowX = container.rotation.x;
            const nowY = container.rotation.y;
            const nowZ = container.rotation.z;
            TweenMax.killTweensOf( container.rotation );
            TweenMax.to(container.rotation,1.0,{
                x:nowX,
                y:nowY+6.28/4,
                z:nowZ,
                ease:Elastic.easeOut.config(1.2, 0.3),
            });
            break;

        case e.which == 115:
            console.log("S!")
            TweenMax.killTweensOf( container.rotation );
            TweenMax.to(container.rotation,0.5,{x:1,y:3,z:0, ease:Expo.easeOut});
            break;

        case e.which == 100:
            console.log("D!")
            TweenMax.to(container.rotation,0.5,{x:Math.random()*5,y:Math.random()*5,z:Math.random()*5, ease:Expo.easeOut});
            break;
    }
})




$(window).on( "resize", resizeHandler);
var setTimeoutId = 0;
resizeHandler();
function resizeHandler(){

    if( setTimeoutId )clearTimeout( setTimeoutId );
    setTimeoutId = setTimeout(function(){

        var width = $(window).width();
        var height = $(window).height();

        const dpr = Math.min(1.5,window.devicePixelRatio);
        tex1Composer.setSize( width*dpr, height*dpr );
        tex2Composer.setSize( width*dpr, height*dpr );
        mainComposer.setSize( width*dpr, height*dpr );

    },200)

}



// var WIDTH = $(window).width();
// var HEIGHT = $(window).height();
//
// var scene_bg = new THREE.Scene();
// var camera_bg = new THREE.OrthographicCamera(0, WIDTH, HEIGHT, 0, 0, 1000);
// var bg_geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10);
// var bg_material = new THREE.MeshBasicMaterial({
//     color: 0x000000,
//     transparent: true,
//     opacity: .3,
//     fog:false,
// });
// var bg = new THREE.Mesh(bg_geometry, bg_material);
//
// //位置調整して追加
// // bg.position.x = WIDTH/2;
// // bg.position.y = HEIGHT/2;
// bg.position.z = -10;
// scene.add(bg);



let mouseX = 0, mouseY = 0;
// 要素の上でマウスが動いた際の処理
$(window).on( "mousemove", (e)=>{
    // console.log(e.clientX/$(window).width(),e.clientY/$(window).height())
    mouseX = e.clientX/$(window).width();
    mouseY = 1.0 - e.clientY/$(window).height();
});
let rl = 0.0;
render();


function render() {

    rl += 0.01;
    if( rl > 6.28 )rl -= 6.28;

    displayObjList.forEach(value=>value.update());
    //
    // circleBoxes.container.position.y = 1.0
    // circlePanels.container.position.y = -2.5
    //
    // circleBoxes.container.position.y = -0.5
    // circleBoxes2.container.position.y = 0.5
    // circleBoxes3.container.position.y = 1.0
    // circleBoxes4.container.position.y = -1.4
    //
    // circlePanels2.container.rotation.y = 3.14/2
    // circlePanels2.container.position.y = -1.5

    // camera.position.x = Math.sin(3*rl) * 1.5;
    // camera.position.y = Math.cos(2*rl) * 1.5;
    // camera.lookAt(new THREE.Vector3());


    // mouseX = ((Math.sin(5*rl)+1.0)/2.0)*0.6 + 0.2;
    // mouseY = ((Math.cos(2*rl)+1.0)/2.0)*0.6 + 0.2;

    // delayShader.uniforms[ 'tDiffusePrev' ].value = rtTexture;//composer.readBuffer.texture;
    delayShader.uniforms[ 'mouseX' ].value = mouseX;
    delayShader.uniforms[ 'mouseY' ].value = mouseY;
    delayShader.uniforms[ 'time' ].value += 1/60;

    delayShader2.uniforms[ 'mouseX' ].value = mouseX;
    delayShader2.uniforms[ 'mouseY' ].value = mouseY;
    delayShader2.uniforms[ 'time' ].value += 1/60;

    delayShader3.uniforms[ 'mouseX' ].value = mouseX;
    delayShader3.uniforms[ 'mouseY' ].value = mouseY;
    delayShader3.uniforms[ 'time' ].value += 1/60;

    // setTimeout(render,1000)

    // renderer.render( scene, camera, rtTexture, false);

    // renderer.render( scene_bg, camera_bg );
    // renderer.render(scene, camera, null, true)


    delayShader.uniforms['tDiffusePrev'].value = tex2;
    delayShader2.uniforms['tDiffusePrev'].value = tex1;
    delayShader3.uniforms['tDiffusePrev'].value = tex1;
    delayShader3.uniforms['textTex'].value = texture;

    tex1Composer.render();

    tex2Composer.render();

    mainComposer.render();



    // delayShader.uniforms[ 'tDiffusePrev' ].value = composer.writeBuffer.texture;
    // delayShader.uniforms[ 'tDiffusePrev' ].value = composer.renderTarget2.texture

    // composer2.render();


    // composer3.render();

    requestAnimationFrame(render);

}

