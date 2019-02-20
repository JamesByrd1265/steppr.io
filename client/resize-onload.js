import $ from 'jquery'
import Nexus from 'nexusui'
import queries from './resize-queries'
import {resizeSequencers} from './index'
import {abbreviateDrumEffects} from './drum-effects'

const resizeOnload = () => {
  if(queries[0].matches) {
    resizeSequencers(160, 268, 545, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[1].matches) {
    resizeSequencers(160, 318, 644, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[2].matches) {
    resizeSequencers(160, 368, 742, 20, 45)
    abbreviateDrumEffects()
  } else if(queries[3].matches) {
    resizeSequencers(200, 424, 856, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[4].matches) {
    resizeSequencers(200, 455, 917, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[5].matches) {
    resizeSequencers(200, 500, 1007, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[6].matches) {
    resizeSequencers(200, 522, 1051, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[7].matches) {
    resizeSequencers(200, 540, 1090, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[8].matches) {
    resizeSequencers(200, 1133, 26, 65)
  } else if(queries[9].matches) {
    resizeSequencers(200, 576, 1162, 26, 65)
    abbreviateDrumEffects()
  } else if(queries[10].matches) {
    resizeSequencers(200, 588, 1186, 29, 65)
    abbreviateDrumEffects()
  } else if(queries[11].matches) {
    resizeSequencers(200, 602, 1215, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[12].matches) {
    resizeSequencers(200, 606, 1240, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[13].matches) {
    resizeSequencers(200, 614, 1271, 30, 70)
  } else if(queries[14].matches) {
    resizeSequencers(200, 616, 1274, 35, 80)
  } else if(queries[15].matches) {
    resizeSequencers(200, 640, 1329, 35, 80)
  } else if(queries[16].matches) {
    resizeSequencers(200, 660, 1360, 35, 80)
  } else if(queries[17].matches) {
    resizeSequencers(200, 680, 1412, 35)
  } else if(queries[18].matches) {
    resizeSequencers(200, 700, 1454, 35)
  } else if(queries[19].matches) {
    resizeSequencers(200, 720, 1493, 35)
  } else if(queries[20].matches) {
    resizeSequencers(200, 740, 1533, 35)
  } else if(queries[21].matches) {
    resizeSequencers(200, 780, 1612, 35)
  } else if(queries[22].matches) {
    resizeSequencers(200, 820, 1693, 35)
  } else if(queries[23].matches) {
    resizeSequencers(200, 860, 1772, 35)
  } else if(queries[24].matches) {
    resizeSequencers(200, 900, 1851, 35)
  } else if(queries[25].matches) { 
    resizeSequencers(200, 940, 1932, 35)
  } else if(queries[26].matches) {
    resizeSequencers(160, 268, 546, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[27].matches) {
    resizeSequencers(160, 318, 644, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[28].matches) {
    resizeSequencers(160, 368, 742, 20, 45)
    abbreviateDrumEffects()
  } else if(queries[29].matches) {
    resizeSequencers(200, 424, 856, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[30].matches) {
    resizeSequencers(200, 455, 917, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[31].matches) {
    resizeSequencers(200, 480, 968, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[32].matches) {
    resizeSequencers(200, 500, 1007, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[33].matches) {
    resizeSequencers(200, 522, 1051, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[34].matches) {
    resizeSequencers(200, 540, 1090, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[35].matches) {
    resizeSequencers(200, 1133, 26, 65)
  } else if(queries[36].matches) {
    resizeSequencers(200, 576, 1162, 26, 65)
    abbreviateDrumEffects()
  } else if(queries[37].matches) {
    resizeSequencers(200, 588, 1186, 29, 65)
    abbreviateDrumEffects()
  } else if(queries[38].matches) {
    resizeSequencers(200, 602, 1215, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[39].matches) {
    resizeSequencers(200, 606, 1240, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[40].matches) {
    resizeSequencers(200, 614, 1271, 30, 70)
  } else if(queries[41].matches) {
    resizeSequencers(200, 616, 1274, 35, 80)
  } else if(queries[42].matches) {
    resizeSequencers(200, 1285, 35, 80)
  } else if(queries[43].matches) {
    resizeSequencers(200, 620, 1288, 35, 80)
  } else if(queries[44].matches) {
    resizeSequencers(200, 640, 1329, 35, 80)
  } else if(queries[45].matches) {
    resizeSequencers(200, 660, 1360, 35, 80)
  } else if(queries[46].matches) {
    resizeSequencers(200, 680, 1412, 35)
  } else if(queries[47].matches) {
    resizeSequencers(200, 700, 1454, 35)
  } else if(queries[48].matches) {
    resizeSequencers(200, 720, 1493, 35)
  } else if(queries[49].matches) {
    resizeSequencers(200, 740, 1533, 35)
  } else if(queries[50].matches) {
    resizeSequencers(200, 780, 1612, 35)
  } else if(queries[51].matches) {
    resizeSequencers(200, 820, 1693, 35)
  } else if(queries[52].matches) {
    resizeSequencers(200, 860, 1772, 35)
  } else if(queries[53].matches) {
    resizeSequencers(200, 900, 1851, 35)
  } else if(queries[54].matches) { 
    resizeSequencers(200, 940, 1932, 35)
  } else if(queries[55].matches) {
    resizeSequencers(200, 268, 546, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[56].matches) {
    resizeSequencers(260, 318, 644, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[57].matches) {
    resizeSequencers(260, 368, 742, 20, 45)
    abbreviateDrumEffects()
  } else if(queries[58].matches) {
    resizeSequencers(260, 424, 856, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[59].matches) { 
    resizeSequencers(260, 455, 917, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[60].matches) { 
    resizeSequencers(260, 480, 968, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[61].matches) {
    resizeSequencers(260, 500, 1007, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[62].matches) {
    resizeSequencers(260, 522, 1051, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[63].matches) {
    resizeSequencers(260, 540, 1090, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[64].matches) {
    resizeSequencers(260, 1133, 26, 65)
  } else if(queries[65].matches) {
    resizeSequencers(260, 576, 1162, 26, 65)
    abbreviateDrumEffects()
  } else if(queries[66].matches) {
    resizeSequencers(260, 588, 1186, 29, 65)
    abbreviateDrumEffects()
  } else if(queries[67].matches) {
    resizeSequencers(260, 602, 1215, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[68].matches) {
    resizeSequencers(260, 606, 1240, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[69].matches) {
    resizeSequencers(260, 606, 1240, 30, 70)
  } else if(queries[70].matches) {
    resizeSequencers(260, 614, 1271, 30, 70)
  } else if(queries[71].matches) {
    resizeSequencers(260, 616, 1274, 35, 80)
  } else if(queries[72].matches) {
    resizeSequencers(260, 617, 1285, 35, 80)
  } else if(queries[73].matches) {
    resizeSequencers(260, 620, 1288, 35, 80)
  } else if(queries[74].matches) {
    resizeSequencers(260, 640, 1329, 35, 80)
  } else if(queries[75].matches) {
    resizeSequencers(260, 660, 1360, 35, 80)
  } else if(queries[76].matches) {
    resizeSequencers(260, 680, 1412, 35)
  } else if(queries[77].matches) {
    resizeSequencers(260, 700, 1454, 35)
  } else if(queries[78].matches) {
    resizeSequencers(260, 720, 1493, 35)
  } else if(queries[79].matches) {
    resizeSequencers(260, 740, 1533, 35)
  } else if(queries[80].matches) {
    resizeSequencers(260, 780, 1612, 35)
  } else if(queries[81].matches) {
    resizeSequencers(260, 820, 1693, 35)
  } else if(queries[82].matches) {
    resizeSequencers(260, 860, 1772, 35)
  } else if(queries[83].matches) {
    resizeSequencers(260, 900, 1851, 35)
  } else if(queries[84].matches) { 
    resizeSequencers(260, 940, 1932, 35)
  } else if(queries[85].matches) {
    resizeSequencers(220, 268, 546, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[86].matches) {
    resizeSequencers(260, 268, 546, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[87].matches) {
    resizeSequencers(260, 318, 644, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[88].matches) {
    resizeSequencers(260, 368, 742, 20, 45)
    abbreviateDrumEffects()
  } else if(queries[89].matches) {
    resizeSequencers(300, 424, 856, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[90].matches) { 
    resizeSequencers(300, 455, 917, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[91].matches) { 
    resizeSequencers(300, 480, 968, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[92].matches) {
    resizeSequencers(300, 500, 1007, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[93].matches) {
    resizeSequencers(300, 522, 1051, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[94].matches) {
    resizeSequencers(300, 540, 1090, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[95].matches) {
    resizeSequencers(300, 1133, 26, 65)
  } else if(queries[96].matches) {
    resizeSequencers(300, 576, 1162, 26, 65)
    abbreviateDrumEffects()
  } else if(queries[97].matches) {
    resizeSequencers(300, 588, 1186, 29, 65)
    abbreviateDrumEffects()
  } else if(queries[98].matches) {
    resizeSequencers(300, 602, 1215, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[99].matches) {
    resizeSequencers(300, 606, 1240, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[100].matches) {
    resizeSequencers(300, 614, 1271, 30, 70)
  } else if(queries[101].matches) {
    resizeSequencers(300, 616, 1274, 35, 80)
    tempo.resize(80, 80)
  } else if(queries[102].matches) {
    resizeSequencers(300, 617, 1285, 35, 80)
    tempo.resize(80, 80)
  } else if(queries[103].matches) {
    resizeSequencers(300, 620, 1288, 35, 80)
    tempo.resize(80, 80)
  } else if(queries[104].matches) {
    resizeSequencers(300, 640, 1329, 35, 80)
  } else if(queries[105].matches) {
    resizeSequencers(300, 660, 1360, 35, 80)
  } else if(queries[106].matches) {
    resizeSequencers(300, 680, 1412, 35)
  } else if(queries[107].matches) {
    resizeSequencers(300, 700, 1454, 35)
  } else if(queries[108].matches) {
    resizeSequencers(300, 720, 1493, 35)
  } else if(queries[109].matches) {
    resizeSequencers(300, 740, 1533, 35)
  } else if(queries[110].matches) {
    resizeSequencers(300, 780, 1612, 35)
  } else if(queries[111].matches) {
    resizeSequencers(300, 820, 1693, 35)
  } else if(queries[112].matches) {
    resizeSequencers(300, 860, 1772, 35)
  } else if(queries[113].matches) {
    resizeSequencers(300, 900, 1851, 35)
  } else if(queries[114].matches) { 
    resizeSequencers(300, 940, 1932, 35)
  } else if(queries[115].matches) {
    resizeSequencers(260, 268, 546, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[116].matches) {
    resizeSequencers(260, 318, 644, 16, 45)
    abbreviateDrumEffects()
  } else if(queries[117].matches) {
    resizeSequencers(260, 368, 742, 20, 45)
    abbreviateDrumEffects()
  } else if(queries[118].matches) {
    resizeSequencers(400, 424, 856, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[119].matches) { 
    resizeSequencers(400, 455, 917, 20, 55)
    abbreviateDrumEffects()
  } else if(queries[120].matches) { 
    resizeSequencers(400, 480, 968, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[121].matches) {
    resizeSequencers(400, 500, 1007, 24, 55)
    abbreviateDrumEffects()
  } else if(queries[122].matches) {
    resizeSequencers(400, 522, 1051, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[123].matches) {
    resizeSequencers(400, 540, 1090, 26, 55)
    abbreviateDrumEffects()
  } else if(queries[124].matches) {
    resizeSequencers(400, 1133, 26, 65)
  } else if(queries[125].matches) {
    resizeSequencers(400, 576, 1162, 26, 65)
    abbreviateDrumEffects()
  } else if(queries[126].matches) {
    resizeSequencers(400, 588, 1186, 29, 65)
    abbreviateDrumEffects()
  } else if(queries[127].matches) {
    resizeSequencers(400, 602, 1215, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[128].matches) {
    resizeSequencers(400, 606, 1240, 30, 65)
    abbreviateDrumEffects()
  } else if(queries[129].matches) {
    resizeSequencers(400, 614, 1271, 30, 70)
  } else if(queries[130].matches) {
    resizeSequencers(400, 616, 1274, 35, 80)
  } else if(queries[131].matches) {
    resizeSequencers(400, 617, 1285, 35, 80)
  } else if(queries[132].matches) {
    resizeSequencers(400, 620, 1288, 35, 80)
  } else if(queries[133].matches) {
    resizeSequencers(400, 640, 1329, 35, 80)
  } else if(queries[134].matches) {
    resizeSequencers(400, 660, 1360, 35, 80)
  } else if(queries[135].matches) {
    resizeSequencers(400, 680, 1412, 35)
  } else if(queries[136].matches) {
    resizeSequencers(400, 700, 1454, 35)
  } else if(queries[137].matches) {
    resizeSequencers(400, 720, 1493, 35)
  } else if(queries[138].matches) {
    resizeSequencers(400, 740, 1533, 35)
  } else if(queries[139].matches) {
    resizeSequencers(400, 780, 1612, 35)
  } else if(queries[140].matches) {
    resizeSequencers(400, 820, 1693, 35)
  } else if(queries[141].matches) {
    resizeSequencers(400, 860, 1772, 35)
  } else if(queries[142].matches) {
    resizeSequencers(400, 900, 1851, 35)
  } else if(queries[143].matches) { 
    resizeSequencers(400, 940, 1932, 35)
  }
}

export default resizeOnload