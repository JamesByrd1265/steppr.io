import $ from 'jquery'
import Nexus from 'nexusui'
import {tempo} from './tempo'
import queries from './resize-queries'
import {resizeSequencers} from './index'
import {abbreviateDrumEffects} from './drum-effects'

const resizeResponsively = () => {
  queries[0].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 268, 545, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[1].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[2].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateDrumEffects()
    }
  })
  queries[3].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[4].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[5].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 500, 1007, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[6].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 522, 1051, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[7].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[8].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 561.5, 1133, 26, 65)
    }
  })
  queries[9].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[10].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 588, 1186, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[11].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[12].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[13].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    }
  })
  queries[14].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    }
  })
  queries[15].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    }
  })
  queries[16].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
    }
  })
  queries[17].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 680, 1412, 35)
    }
  })
  queries[18].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 700, 1454, 35)
    }
  })
  queries[19].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 720, 1493, 35)
    }
  })
  queries[20].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 740, 1533, 35)
    }
  })
  queries[21].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 780, 1612, 35)
    }
  })
  queries[22].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 820, 1693, 35)
    }
  })
  queries[23].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 860, 1772, 35)
    }
  })
  queries[24].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 900, 1851, 35)
    }
  })
  queries[25].addListener(e => {
    if(e.matches) { 
      resizeSequencers(200, 940, 1932, 35)
    }
  })
  queries[26].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 268, 546, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[27].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[28].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateDrumEffects()
    }
  })
  queries[29].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[30].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[31].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 480, 968, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[32].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 500, 1007, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[33].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 522, 1051, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[34].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[35].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 561.5, 1133, 26, 65)
    }
  })
  queries[36].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[37].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 588, 1186, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[38].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[39].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[40].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    }
  })
  queries[41].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    }
  })
  queries[42].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 1285, 35, 80)
    }
  })
  queries[43].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 620, 1288, 35, 80)
    }
  })
  queries[44].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    }
  })
  queries[45].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
    }
  })
  queries[46].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 680, 1412, 35)
    }
  })
  queries[47].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 700, 1454, 35)
    }
  })
  queries[48].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 720, 1493, 35)
    }
  })
  queries[49].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 740, 1533, 35)
    }
  })
  queries[50].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 780, 1612, 35)
    }
  })
  queries[51].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 820, 1693, 35)
    }
  })
  queries[52].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 860, 1772, 35)
    }
  })
  queries[53].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 900, 1851, 35)
    }
  })
  queries[54].addListener(e => {
    if(e.matches) { 
      resizeSequencers(200, 940, 1932, 35)
    }
  })
  queries[55].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 268, 546, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[56].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[57].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateDrumEffects()
    }
  })
  queries[58].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 424, 856, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[59].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 455, 917, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[60].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 480, 968, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[61].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 500, 1007, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[62].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 522, 1051, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[63].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 540, 1090, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[64].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 561.5, 1133, 26, 65)
    }
  })
  queries[65].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 576, 1162, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[66].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 588, 1186, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[67].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 602, 1215, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[68].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 606, 1240, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[69].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 606, 1240, 30, 70)
    }
  })
  queries[70].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 614, 1271, 30, 70)
    }
  })
  queries[71].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 616, 1274, 35, 80)
    }
  })
  queries[72].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 617, 1285, 35, 80)
    }
  })
  queries[73].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 620, 1288, 35, 80)
    }
  })
  queries[74].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 640, 1329, 35, 80)
    }
  })
  queries[75].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 660, 1360, 35, 80)
    }
  })
  queries[76].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 680, 1412, 35)
    }
  })
  queries[77].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 700, 1454, 35)
    }
  })
  queries[78].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 720, 1493, 35)
    }
  })
  queries[79].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 740, 1533, 35)
    }
  })
  queries[80].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 780, 1612, 35)
    }
  })
  queries[81].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 820, 1693, 35)
    }
  })
  queries[82].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 860, 1772, 35)
    }
  })
  queries[83].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 900, 1851, 35)
    }
  })
  queries[84].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 940, 1932, 35)
    }
  })
  queries[85].addListener(e => {
    if(e.matches) {
      resizeSequencers(220, 268, 546, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[86].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[87].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[88].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateDrumEffects()
    }
  })
  queries[89].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 424, 856, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[90].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 455, 917, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[91].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 480, 968, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[92].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 500, 1007, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[93].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 522, 1051, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[94].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 540, 1090, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[95].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 561.5, 1133, 26, 65)
    }
  })
  queries[96].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 576, 1162, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[97].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 588, 1186, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[98].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 602, 1215, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[99].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 606, 1240, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[100].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 614, 1271, 30, 70)
    }
  })
  queries[101].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 616, 1274, 35, 80)
    }
  })
  queries[102].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 617, 1285, 35, 80)
    }
  })
  queries[103].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 620, 1288, 35, 80)
    }
  })
  queries[104].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 640, 1329, 35, 80)
    }
  })
  queries[105].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 660, 1360, 35, 80)
    }
  })
  queries[106].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 680, 1412, 35)
    }
  })
  queries[107].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 700, 1454, 35)
    }
  })
  queries[108].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 720, 1493, 35)
    }
  })
  queries[109].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 740, 1533, 35)
    }
  })
  queries[110].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 780, 1612, 35)
    }
  })
  queries[111].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 820, 1693, 35)
    }
  })
  queries[112].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 860, 1772, 35)
    }
  })
  queries[113].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 900, 1851, 35)
    }
  })
  queries[114].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 940, 1932, 35)
    }
  })
  queries[115].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[116].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateDrumEffects()
    }
  })
  queries[117].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateDrumEffects()
    }
  })
  queries[118].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 424, 856, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[119].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 455, 917, 20, 55)
      abbreviateDrumEffects()
    }
  })
  queries[120].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 480, 968, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[121].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 500, 1007, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[122].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 522, 1051, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[123].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 540, 1090, 26, 55)
      abbreviateDrumEffects()
    }
  })
  queries[124].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 561.5, 1133, 26, 65)
    }
  })
  queries[125].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 576, 1162, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[126].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 588, 1186, 26, 65)
      abbreviateDrumEffects()
    }
  })
  queries[127].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 602, 1215, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[128].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 606, 1240, 30, 65)
      abbreviateDrumEffects()
    }
  })
  queries[129].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 614, 1271, 30, 70)
    }
  })
  queries[130].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 616, 1274, 35, 80)
    }
  })
  queries[131].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 617, 1285, 35, 80)
    }
  })
  queries[132].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 620, 1288, 35, 80)
    }
  })
  queries[133].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 640, 1329, 35, 80)
    }
  })
  queries[134].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 660, 1360, 35, 80)
    }
  })
  queries[135].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 680, 1412, 35)
    } else {
      tempo.resize(90, 90)
    }
  })
  queries[136].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 700, 1454, 35)
    }
  })
  queries[137].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 720, 1493, 35)
    }
  })
  queries[138].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 740, 1533, 35)
    }
  })
  queries[139].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 780, 1612, 35)
    }
  })
  queries[140].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 820, 1693, 35)
    }
  })
  queries[141].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 860, 1772, 35)
    }
  })
  queries[142].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 900, 1851, 35)
    }
  })
  queries[143].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 940, 1932, 35)
    }
  })
}

export default resizeResponsively