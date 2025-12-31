class A {
    constructor() {
        this.b = {};
        this.c = 0.45;
        this.d = {};
        this.e = {};
        this.f = {
            tfidf: 0.25,
            bm25: 0.25,
            jaroWinkler: 0.15,
            levenshtein: 0.10,
            sequence: 0.10,
            fuzzy: 0.10,
            keyword: 0.05
        };
    }

    async g(h = 'knowledge_base.json') {
        try {
            const i = await fetch(h);
            if (!i.ok) {
                throw new Error(`HTTP错误! 状态: ${i.status}`);
            }
            this.b = await i.json();

            this.d = this.m();

            this.e = this.p();

            return true;
        } catch (error) {
            console.error('加载知识库失败:', error);
            this.b = {
                "徒步是什么？": "每年3月，初一、初二、高一和高二会到松山湖边徒步，高中部全长约20公里（学校说的是21.1公里，实际测的数据有较大误差，需要求证）。",
                "有两次军训？": "这是因为2024级第一次军训的时长和教官不符合教育部、中央军委国防动员部联合印发《高中阶段学校学生军事训练教学大纲》的要求（需要求证），所以在高一下重训了。理论上其他级都不会军训两次。",
                "国标体侧？": "这是每年上学期的时候，省里面合成抽查每个市的体育素质；每个市抽部分学校；被抽到的学校则每个年级抽三个班级，其中两个是普通的，每班男女各10人（需要求证：人数）；一个是替补的，男女各15人（需要求证：人数），被抽中后需要在周六早上延迟返学和周日下午提前上学加训，每天下午也要加训（竞赛权重没它高）。",
                "可以带书箱或书袋吗？": "在不占用过道的情况下是可以的，建议买书箱放在椅子底下，容许宽度约为28cm（需要求证：这个尺寸是合适的，但这是最大尺寸吗）",
                "能带手机吗？": "原则上不能，其他普高都一样。但可以向班主任要一份带手机入校申请书的电子版，打印后填写并家长签字，就可以带手机入校，但在上学的日子要交给老师，周末放学后取回。",
                "手机可以寄存在班主任那吗？": "可以。更多内容请询问关键词：“能带手机吗？”",
                "能带泡面吗？": "原则上不能。",
                "手表能戴什么类型的？": "原则上只能带机械手表。",
                "电子产品抓的严不严？": "原则上请按照校规携带合格的电子产品，不要挑战校规。",
                "要跑操吗？": "如果不下雨、地面湿滑或其他特殊情况，那么每天都要",
                "能带相机吗？": "原则上不能。更多内容请询问关键词“融媒体社”或“摄影证？”",
                "上课能喝饮料吗？": "因老师而异。",
                "上课能喝水吗？": "理论上都是可以。",
                "上课能吃零食吗？": "因老师而异。请尊重老师，不要在课上吃东西。",
                "军训可以用防晒霜吗？": "如果不用，必定会被晒伤，请保护好自己，用好防晒霜，即使大部分防晒霜的防晒黑的效果都很差。",
                "在学校可以打游戏吗？": "原则上不能在学校打游戏。",
                "学校谈恋爱的多吗？": "原则上不要谈恋爱，除非对方能给你动力，能保证学习不落下甚至上升的同时谈恋爱。",
                "能不能买不透明的蚊帐？": "原则上不能。",
                "能挂床帘吗？": "原则上不能。",
                "可以带刀吗？": "指甲刀（指甲钳）可以，其余不能。请做一个遵纪守法的好公民。",
                "可以在教室吃早餐吗？": "因班主任而异。",
                "可以带耳钉吗？": "原则上不能。",
                "早读要站吗？": "齐读的时候站立，",
                "可以用自己的卡套吗？": "可以。",
                "校卡卡套可以不透明吗？": "可以，但偶尔自己也要拿出来看学号等信息。",
                "可以烫头吗？": "原则上不能。",
                "可以卷毛吗？": "原则上不能。",
                "电子产品被没收了什么时候还？": "原则上是180天。请不要违规带电子产品。",
                "可以带电蚊拍吗？": "让班委买就可以了，一个班一两个放教室就够了，宿舍拉蚊帐即可。",
                "可以带小风扇吗？": "可以，但声音别太大，转得跟飞机引擎似的就别带了。",
                "可以点外卖吗？": "原则上学生不能。",
                "仪容仪表？": "指甲不能长；男生头发前不过眉后不过肩侧不遮耳，女生头发扎起来；不戴各种首饰挂饰。",
                "学校机房可以插U盘吗？": "可以，但有多名非常爱惜U盘的同学在完全正规的操作下烧坏了U盘，原因暂不明确。",
                "冬天冷能穿自己的衣服吗？": "达到一定温度就可以。",
                "宿舍电梯？": "宿舍的电梯仅对6层以上开放，每天都可以做。（关于教学楼电梯请询问关键词“教学楼电梯？”）",
                "教学楼电梯？": "教学楼的通常需要老师刷脸才可以坐，有不少老师都是很热心的。有时学校有活动或者有大批同学需要搬东西时也会直接开放使用。（关于宿舍电梯请询问关键词“宿舍电梯？”）",
                "电梯？": "（请锁定关键词：“宿舍电梯？”或“教学楼电梯？",
                "周末时间？": "一般情况下，周五下午5点（17点）放学，周日晚上6点30分（18点30分）前到班",
                "宿舍怎么样？": "非常好。",
                "宿管怎么样？": "有的比较温柔，有的稍微没那么温柔，但宿管是谁并不能由您来挑。",
                "导师制度是什么？": "周五下午第八节是导师课，在导师课可以上自己选的导师的课，可以谈心，可以运动，可以做很多事情。选择的导师并不全由您决定，因为每个班只有大约3个科任老师或者班主任可选，选择也是以宿舍为单位的，需要与舍友达成统一。",
                "学校有混的人吗？": "理论上每个学校都有。",
                "体育课多吗？": "每周两节体育课。",
                "有蟑螂吗？": "不多。",
                "有蚯蚓吗？": "入夏后比较多。",
                "有小卖铺吗？": "其实叫面包房，有卖面包、牛奶和一些日用品。",
                "什么时候有热水？": "饮用热水和洗澡的热水都是24h的，但由于洗澡水的热水器的主要热源是太阳能，电力加热只是辅助，所以如果遇到连续的阴雨天，可能没有热水，或者不够热。",
                "智慧笔是什么？": "在特定的纸（点阵纸）上写字后老师可以直接在电脑上看，看到你的自己和写在哪一张纸上，练习册都是这种纸，老师能看到你每一页写了什么。",
                "高二有智慧笔吗？": "没有。",
                "学校不会很多书呆子吧？": "恰恰相反。",
                "可以刷同学的饭卡吗？": "如果同学允许的话，是可以的。",
                "要自己洗衣服吗？": "是的，关于洗衣机请询问关键词“宿舍有洗衣机吗”。",
                "智慧餐厅是什么？": "称重计费的自助餐，到那里可以看操作说明，物价偏高。",
                "周末作业多不多？": "因老师而异。",
                "体育课强度大吗？": "因老师而异。",
                "要体测吗？": "除了国标体侧，只有期末考的体育。关于国标体侧，请询问关键词“国标体侧？”",
                "每个班都有冰箱吗？": "否。您可以向班主任申请用班费购买一台冰箱放在教室后面，甚至可以毕业后转卖二手的。",
                "体育馆经常开放吗？": "是。",
                "宿舍晚归有惩罚吗？": "宿舍扣一分。",
                "宿舍晚出有惩罚吗？": "宿舍扣一分。",
                "宿舍内务？": "一人一个岗位，自行商量或先到先得，填写在门口的表中。",
                "可以刷脸支付吗？": "可以，但识别速度极其不稳定，建议带饭卡避免耽误自己与他人的宝贵时间。",
                "宿舍柜子有几格？": "两格，上面的较高，下面的较矮，其中上面的格可以有横杆挂衣架。",
                "放学可以打球吗？": "可以，室外篮球场，体育馆3楼羽毛球场，不跟校队抢就好了。",
                "图书馆长期开放吗？": "看通知，变动较大，通常是开的，但中午下班时间比放学早，需要课间冲过去才能借还书籍。",
                "有空宿舍吗？": "理论上都是有的，不可能那么正好，即使招生总人数是恒定的，但男女比例是不定的。",
                "如何打电话？": "到时候会发一个单子，购买“亲情电话”，如果购买，那么三年都可以用学校各个承重柱上的电话打电话，收费比较实惠，基本每个人都买，因为基本是必需品。注意每次通话限时5分钟，只要打通了，挂断后再打需要间隔1分钟。",
                "宿舍是几人间？": "目前高一、二男生是7人间，高三男生6人间，女生是6人间。",
                "宿舍有吹风机吗？": "有，男生宿舍每层有两个；女生宿舍管够。",
                "舍友会变吗？": "高一下因为选科重新分班，一定会变，其他的因班主任而异。",
                "家长可以送饭吗？": "可以，在门口拿就行了。",
                "游泳馆什么时候开？": "开了。",
                "如何进入游泳馆？": "开放时间是周日下午，三点到四点，四点到五点两个时间段，报名就可以去，限80个。",
                "宿舍有洗衣机吗？": "5楼以下有，高一用不着。",
                "体育课可以穿自己的衣服吗？": "可以，结束后及时换下即可。",
                "如何进健身房？": "校本课的老师和同学可以进。",
                "一个班多少人？": "第一次分班每班40~50人不等；第二次分班院士班在48人左右，其他理科班在50~60人左右，文科班在35至45人左右，科创班的人数取决于报的人，港澳班取决于招的人。",
                "院士班是哪个班？": "理科班：1班、2班；文科班：15班。",
                "一共分几次班？": "2次。入学时第一次，高一上结束第二次。第一次以中考成绩，第二次以三次段考与中考成绩。",
                "平板什么时候会发？": "高二。",
                "什么时候选科？": "高一上全级统一，高一上结束后选科，分班依据选的六科的高一上三次段考分和中考分，其中期末考的权重最高。",
                "竞赛是什么？": "通常指的是五大学科竞赛（其他竞赛请询问作者或管理员）：中国数学（物理、化学、生物学或信息学）奥林匹克竞赛，参加后可以用于强基计划、综评等项目降分录取，如果有能力拿到国金等奖项，甚至可以直接报送清北等学校。",
                "所有人都可以参加竞赛吗？": "否，需要在高一9月初（甚至更早）报名选拔考试，然后进入学校竞赛队了，才可以进行竞赛培训，接下来才能参加比赛。如果落榜了也可以自学，跟老师要一个参赛机会。",
                "竞赛什么时候上课？": "在课内课程完全不落下的情况下，周三和周四的第8节（校本课和特色课）以及周六上竞赛，暑假的8月也会上竞赛。",
                "教材是什么版本的？": "高考的九科除了地理是中图版，其余都是人教版。此处有人教社官方的电子版以供参考：https://jc.pep.com.cn/。（若连接失效，请联系作者或管理员）",
                "如何选科？": "注意物化绑定的同时，选择自己喜欢喜欢并擅长的，且利于选自己大学专业的选科。",
                "港澳生必须去港澳班吗？": "如果成绩优秀，可以去院士班。",
                "港澳生可以去院士班吗？": "可以。",
                "强基班是哪个班？": "除了院士班、科创班和港澳班的都是强基班。",
                "港澳班是哪个班？": "18班。",
                "高中生物难还是地理难？": "因人而异，可能都难。",
                "港澳班分班吗？": "不分。",
                "军训的班级就是高一上的班级吗？": "是。",
                "有开学考吗？": "没有，高三第一周开始周测算开学考吧。",
                "作业是打印的还是练习册？": "都有。",
                "学考是什么？": "合格性考试，考六门小科目（历史、化学、地理、生物、物理和政治）的必修内容，全都是选择题。如果您只参加普通高考升学，那么几格即可；如果您想通过强基计划、综评等方式升学，越多A（全省前15%）越好。",
                "什么时候学考？": "高一下学期末考历史、化学、地理和生物，高二上期末考物理和政治。",
                "科创班是哪个班？": "每个年级不同，2023级是12班（与港澳班混班，后拆散），2024级是14班。",
                "学校的活动多吗？": "相当多。",
                "有社团活动吗？": "有非常多，会在每年9月左右招新，请留意电子班牌的信息。",
                "可以同时参加多个社团吗？": "在能兼顾学习且时间不相撞的情况下可以。",
                "校庆有什么活动？": "2023年每人发了一个小蛋糕，2024年每人发了一瓶酸奶，2025年每人发了一个小蛋糕。",
                "校庆在什么时候？": "每年的9月9日。",
                "研学有哪些地方？": "非常多，可以是4天的省外（稍贵），也可以是3天的省内（较便宜），还有松山湖半日游（免费）。",
                "回母校宣讲？": "是学校的一个活动，可以加学分，自愿参加，只有高一能参加，学校同时会发一些物资，原则上是给您的，但您可以选择赠与学弟学妹们。",
                "如何进入学生会？": "军训时会有学生会人员来招的，届时领取ta的表格并填写交回即可。",
                "如何竞选主持人？": "学校会发公告，请留意电子班牌。",
                "有学生会吗？": "有。更多内容请询问关键词：“如何进入学生会？”",
                "融媒体社？": "这是学校的一个部门，成为其中的一员后可以在学校的活动中进行拍摄，在学校大型活动的直播中拍摄或作导播，接触的设备也是比较高级的。",
                "摄影证？": "这是一个学校的证件，有了该证件后就可以携带相机进学校了，因为原本原则上是不能带的。",
                "学生会和社团只能选一个吗？": "否。",
                "学生会和竞赛只能选一个吗？": "否，但时间无法兼顾。",
                "社团和竞赛只能选一个吗？": "否，但时间可能无法兼顾。",
                "有乐队吗？": "有。详情请咨询各乐队队长。",
                "如何入共青团？": "提前在校内校外的各个机构做志愿达到志愿时长，在每年入团的时间积极表现，争取名额，按时参加各项课程即可。",
                "研学每年都有吗？": "在每年的上学期。",
                "有成人礼吗？": "高三就有，理论上每个学校都有。",
                "有漂流瓶这个活动吗？": "高一高二有，高三没有。",
                "有没有广播站？": "有。",
                "天文馆开放吗？": "学校有活动的时候会开。",
                "广播站是什么？": "就是广播。",
                "如何进广播站？": "留意电子班牌。",
                "研学在什么时候？": "每年不一样。2024年在11月9日选路线，省外在11月20日出发，省内在11月21日，松山湖在22日。（更多内容请询问关键词“研学有哪些地方？”",
                "公共交通？": "最近的地铁站是一号线的松佛地铁站（6.4km），最近的城市轨道交通是万象汇的松山湖北站（10km），最近的机场是深圳宝安机场（47km），不建议乘坐公共交通上学，可以考虑与熟人或同学拼车。",
                "需要自己带床上用品吗？": "是的。",
                "床上用品的规格？": "参考下面公众号文章链接的“三、报道物品准备 - 生活类”：https://mp.weixin.qq.com/s/AKc1IeUhg5nJJBrm9GXxPQ",
                "注册要去学校吗？": "不用，线上注册即可。",
                "注册是线上注册吗？": "是的。",
                "录取通知书是纸质版的还是电子版的？": "电子版，但事实上这是全市统一的模板。",
                "军训要穿迷彩服吗": "不用。",
                "在哪里军训？": "学校里。",
                "什么时候军训？": "每年时间不一样，请询问作者或管理员。",
                "排水怎么样？": "和Minecraft一样，不去处理，水就会一直堆在那。",
                "没有军训的要补训吗？": "超过半天没有的就要，而且很尴尬。",
                "学生导师是什么？": "是学生。军训前为您讲解学校的日常安排，军训时陪伴您。",
                "学校发的平板是多大的？": "详见：https://mo-hen.com/?page_id=637。（若连接失效，请联系作者或管理员）",
                "学生导师是学生吗？": "是。",
                "学生导师能带手机吗？": "能。",
                "校服怎么买？": "钉钉群会发，到时统一购买，后续可在校门口的自行购买。",
                "宿舍有地方放行李箱吗？": "有。",
                "团员资料如何转？": "开学后选了班级团书记问团书记。",
                "没有导出确认表怎么办？": "联系公众号文章底下的电话，注意是否在其上班时间。",
                "饭堂要自带餐具吗？": "否。",
                "床位是由学校分吗？": "原则上是。",
                "如果休学一年还能上未来吗？": "能。",
                "初升高暑假有作业吗？": "此问题请询问作者或管理员。",
                "书包自己准备吗？": "是。",
                "可以多带几双鞋吗？": "可以，楼梯的柜子，里面用于存放多的鞋子。",
                "发校卡套吗？": "发，当然也可以用自己的，可以不透明，但偶尔自己也要拿出来看学号等信息。",
                "宿舍空调？": "当校方的温度计显示室外空气温度在26摄氏度以上时，宿舍就可以开空调了，空调温度设定在26摄氏度，不允许自行携带空调遥控器调空调温度、风速或模式，也不允许把空调内机或外机拆下来带回家。",
                "饭堂有空调吗？": "有。",
                "教室环境怎么样？": "除了一楼教室因为天花板过高可能会有蜘蛛网在顶上，其余的环境都是非常怡人的。",
                "氛围怎么样？": "氛围很不错。",
                "人均上补习班吗？": "恰恰相反。",
                "学校粥批多吗？": "蟑螂多，粥批不知道。",
                "健身房什么时候开？": "一直都开，不一定能进去而已。",
                "物价怎么样？": "平价。",
                "厕所有异味吗？": "由于包间的冲水是自动的而没有手动的，所以有的可能会有骚臭味，不够每天都会有物业清理。",
                "二次元含量高吗？": "相当高。",
                "教师有没有插座？": "有。",
                "校园墙？": "微信号：SSHWLQ2022。（如果发生修改请联系作者或管理员修正此回答）",
                "男女比例怎么样？": "总体偏高。",
                "宿舍有插座吗？": "有且仅有空调一个插座。",
                "学校大吗？": "98203平方米。",
                "开学就竞选主持人，会被人歧视吗？": "“走自己的路，让别人说去吧。”——但丁",
                "2025年桦加沙台风停课后什么时候返校的？": "原本说是周四晚修前到校，后来改成了周四早上10点。"
            };

            this.d = this.m();

            this.e = this.p();

            return false;
        }
    }

    i(j) {
        j = j.replace(/[^\u4e00-\u9fa5\w\s]/g, '').toLowerCase().trim();

        if (!j) return [];

        const k = j.split('').filter(c => c.trim());
        const l = [...k];

        for (let m = 0; m < k.length - 1; m++) {
            l.push(k[m] + k[m + 1]);
        }

        return l;
    }

    m() {
        const n = Object.keys(this.b).length;
        if (n === 0) return {};

        const o = {};

        Object.keys(this.b).forEach(p => {
            const q = new Set(this.i(p));
            q.forEach(r => {
                o[r] = (o[r] || 0) + 1;
            });
        });

        const s = {};
        Object.keys(o).forEach(t => {
            s[t] = Math.log((n + 1) / (o[t] + 1)) + 1;
        });

        return s;
    }

    p() {
        const q = {};

        Object.keys(this.b).forEach(r => {
            const s = this.i(r);
            s.forEach(t => {
                if (!q[t]) q[t] = new Set();
                q[t].add(r);
            });
        });

        return q;
    }

    r(s, t = 20) {
        const u = this.i(s);
        const v = {};

        u.forEach(w => {
            if (this.e[w]) {
                this.e[w].forEach(x => {
                    v[x] = (v[x] || 0) + 1;
                });
            }
        });

        if (Object.keys(v).length < 5) {
            return Object.keys(this.b);
        }

        return Object.entries(v)
            .sort((a, b) => b[1] - a[1])
            .slice(0, t)
            .map(entry => entry[0]);
    }

    w(x, y) {
        const z = this.i(x);
        const a1 = this.i(y);

        const b1 = {};
        const c1 = {};

        z.forEach(d1 => { b1[d1] = (b1[d1] || 0) + 1; });
        a1.forEach(e1 => { c1[e1] = (c1[e1] || 0) + 1; });

        const d1 = new Set([...z, ...a1]);

        let e1 = 0;
        let f1 = 0;
        let g1 = 0;

        d1.forEach(h1 => {
            const i1 = this.d[h1] || 1.0;
            const j1 = (b1[h1] || 0) * i1;
            const k1 = (c1[h1] || 0) * i1;

            e1 += j1 * k1;
            f1 += j1 ** 2;
            g1 += k1 ** 2;
        });

        if (f1 === 0 || g1 === 0) {
            return 0.0;
        }

        return e1 / (Math.sqrt(f1) * Math.sqrt(g1));
    }

    k1(l1, m1) {
        const n1 = 1.5;
        const o1 = 0.75;

        const p1 = this.i(l1);
        const q1 = this.i(m1);

        const r1 = q1.length;
        const s1 = Object.keys(this.b);
        const t1 = s1.reduce((u1, v1) => u1 + this.i(v1).length, 0) / Math.max(s1.length, 1);

        const u1 = {};
        q1.forEach(v1 => { u1[v1] = (u1[v1] || 0) + 1; });

        let v1 = 0.0;
        const w1 = [...new Set(p1)];

        w1.forEach(x1 => {
            if (!u1[x1]) return;

            const y1 = u1[x1];
            const z1 = this.d[x1] || 1.0;

            const a2 = y1 * (n1 + 1);
            const b2 = y1 + n1 * (1 - o1 + o1 * (r1 / t1));
            v1 += z1 * (a2 / b2);
        });

        return Math.min(v1 / (w1.length + 1), 1.0);
    }

    b2(c2, d2) {
        if (c2 === d2) return 1.0;

        if (c2.length > d2.length) {
            [c2, d2] = [d2, c2];
        }

        let e2 = Array.from({ length: c2.length + 1 }, (_, i) => i);

        for (let j = 1; j <= d2.length; j++) {
            let f2 = [j];
            for (let i = 1; i <= c2.length; i++) {
                if (c2[i - 1] === d2[j - 1]) {
                    f2.push(e2[i - 1]);
                } else {
                    f2.push(1 + Math.min(
                        e2[i - 1],
                        e2[i],
                        f2[f2.length - 1]
                    ));
                }
            }
            e2 = f2;
        }

        const g2 = Math.max(c2.length, d2.length);
        if (g2 === 0) return 1.0;

        return 1.0 - (e2[e2.length - 1] / g2);
    }

    h2(i2, j2) {
        if (i2 === j2) return 1.0;

        const k2 = i2.length;
        const l2 = j2.length;

        if (k2 === 0 || l2 === 0) return 0.0;

        const m2 = Math.max(k2, l2) / 2 - 1;
        const n2 = Math.max(0, Math.floor(m2));

        const o2 = new Array(k2).fill(false);
        const p2 = new Array(l2).fill(false);

        let q2 = 0;

        for (let i = 0; i < k2; i++) {
            const start = Math.max(0, i - n2);
            const end = Math.min(i + n2 + 1, l2);

            for (let j = start; j < end; j++) {
                if (p2[j] || i2[i] !== j2[j]) continue;

                o2[i] = true;
                p2[j] = true;
                q2++;
                break;
            }
        }

        if (q2 === 0) return 0.0;

        let r2 = 0;
        let s2 = 0;

        for (let i = 0; i < k2; i++) {
            if (!o2[i]) continue;

            while (!p2[s2]) s2++;

            if (i2[i] !== j2[s2]) r2++;
            s2++;
        }

        const t2 = (
            q2 / k2 +
            q2 / l2 +
            (q2 - r2 / 2) / q2
        ) / 3;

        let u2 = 0;
        for (let i = 0; i < Math.min(k2, l2, 4); i++) {
            if (i2[i] === j2[i]) {
                u2++;
            } else {
                break;
            }
        }

        return t2 + u2 * 0.1 * (1 - t2);
    }

    v2(w2, x2) {
        if (w2 === x2) return 1.0;
        if (w2.length === 0 || x2.length === 0) return 0.0;

        let y2 = 0;
        const z2 = Math.max(w2.length, x2.length);

        for (let i = 0; i < Math.min(w2.length, x2.length); i++) {
            if (w2[i] === x2[i]) y2++;
        }

        return y2 / z2;
    }

    a3(b3, c3) {
        const d3 = b3.toLowerCase();
        const e3 = c3.toLowerCase();

        if (d3.includes(e3) || e3.includes(d3)) return 1.0;

        const f3 = d3.length;
        const g3 = e3.length;

        const h3 = Array.from({ length: f3 + 1 }, () => new Array(g3 + 1).fill(0));

        for (let i = 1; i <= f3; i++) {
            for (let j = 1; j <= g3; j++) {
                if (d3[i - 1] === e3[j - 1]) {
                    h3[i][j] = h3[i - 1][j - 1] + 1;
                } else {
                    h3[i][j] = Math.max(h3[i - 1][j], h3[i][j - 1]);
                }
            }
        }

        const i3 = h3[f3][g3];
        return i3 / Math.max(f3, g3);
    }

    j3(k3, l3) {
        const m3 = new Set(this.i(k3));
        const n3 = new Set(this.i(l3));

        if (m3.size === 0 || n3.size === 0) return 0.0;

        const o3 = new Set([...m3].filter(x => n3.has(x)));
        const p3 = new Set([...m3, ...n3]);

        const q3 = o3.size / p3.size;

        const r3 = o3.size / m3.size;

        return 0.5 * q3 + 0.5 * r3;
    }

    s3(t3, u3) {
        const v3 = this.w(t3, u3);
        const w3 = this.k1(t3, u3);
        const x3 = this.h2(t3, u3);
        const y3 = this.b2(t3, u3);
        const z3 = this.v2(t3, u3);
        const a4 = this.a3(t3, u3);
        const b4 = this.j3(t3, u3);

        const c4 = (
            this.f.tfidf * v3 +
            this.f.bm25 * w3 +
            this.f.jaroWinkler * x3 +
            this.f.levenshtein * y3 +
            this.f.sequence * z3 +
            this.f.fuzzy * a4 +
            this.f.keyword * b4
        );

        return c4;
    }

    d4(e4) {
        if (!e4.trim()) {
            return { question: null, score: 0.0 };
        }

        if (e4.includes('夏令营')) {
            return {
                question: '夏令营问题需联系管理员',
                score: 1.0,
                special: true,
                message: '此问题请询问作者或管理员。'
            };
        }

        const f4 = this.r(e4);

        if (f4.length === 0) {
            return { question: null, score: 0.0 };
        }

        let g4 = null;
        let h4 = 0.0;

        f4.forEach(i4 => {
            const j4 = this.s3(e4, i4);
            if (j4 > h4) {
                h4 = j4;
                g4 = i4;
            }
        });

        return { question: g4, score: h4 };
    }

    k4(l4) {
        const m4 = this.d4(l4);

        if (m4.special) {
            return {
                answer: m4.message,
                confidence: 100,
                redirectedQuestion: m4.question,
                matched: true
            };
        }

        if (m4.question && m4.score >= this.c) {
            const n4 = this.b[m4.question];
            const o4 = Math.round(m4.score * 100);

            return {
                answer: n4,
                confidence: o4,
                redirectedQuestion: m4.question,
                matched: true
            };
        } else {
            return {
                answer: '此问题还没有答案，请联系作者或管理员。',
                confidence: Math.round(m4.score * 100),
                redirectedQuestion: m4.question || '无匹配',
                matched: false
            };
        }
    }
}

const p4 = new A();

document.addEventListener('DOMContentLoaded', async() => {
    function q4() {
        const r4 = new Date();
        document.getElementById('current-time').textContent =
            `${r4.getHours().toString().padStart(2, '0')}:${r4.getMinutes().toString().padStart(2, '0')}:${r4.getSeconds().toString().padStart(2, '0')}`;
    }

    setInterval(q4, 1000);
    q4();

    await p4.g();

    document.getElementById('send-btn').addEventListener('click', r4);

    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            r4();
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('chat-messages').innerHTML = `
            <div class="message bot">
                <div class="message-header">
                    <span class="sender">系统</span>
                    <span class="time" id="current-time"></span>
                </div>
                <div class="message-content">
                    请输入您的问题，我将从知识库中查找最佳匹配的答案。
                </div>
            </div>
        `;
        q4();
    });

});

function r4() {
    const s4 = document.getElementById('user-input');
    const t4 = s4.value.trim();

    if (!t4) return;

    d5('user', t4, '用户');

    let u4 = false;

    if (t4.includes('时候')) {
        const v4 = '如果是关于日常作息的，请见下面这个链接的文档：<br><a href="https://docs.qq.com/sheet/DSEVCYkJhUXVGVVFs" target="_blank">https://docs.qq.com/sheet/DSEVCYkJhUXVGVVFs</a><br><br>如果您需要继续提问此问题，请点击"继续提问"按钮：<br><button class="continue-btn" onclick="x4(\'' + encodeURIComponent(t4) + '\')">继续提问此问题</button>';
        d5('bot', v4, '系统');
        u4 = true;
    }

    if (t4.includes('哪里') || t4.includes('在哪')) {
        const v4 = '如果是关于学校建筑位置的，请见下面这个链接的文档：<br><a href="https://docs.qq.com/pdf/DSHBieVVBS01RUUZU" target="_blank">https://docs.qq.com/pdf/DSHBieVVBS01RUUZU</a><br><br>如果您需要继续提问此问题，请点击"继续提问"按钮：<br><button class="continue-btn" onclick="x4(\'' + encodeURIComponent(t4) + '\')">继续提问此问题</button>';
        d5('bot', v4, '系统');
        u4 = true;
    }

    if (!u4) {
        const w4 = p4.k4(t4);

        let v4 = '';
        if (w4.matched) {
            v4 = `
                <strong>重定向至：</strong>${w4.redirectedQuestion}<br>
                <strong>解答：</strong>${w4.answer}
            `;
        } else {
            v4 = w4.answer;
        }

        d5('bot', v4, '系统');
    }

    s4.value = '';
    s4.focus();

    const x5 = document.getElementById('chat-messages');
    x5.scrollTop = x5.scrollHeight;
}


function x4(y4) {
    const z4 = decodeURIComponent(y4);

    const a5 = p4.k4(z4);

    let b5 = '';
    if (a5.matched) {
        b5 = `
            <strong>重定向至：</strong>${a5.redirectedQuestion}<br>
            <strong>解答：</strong>${a5.answer}
        `;
    } else {
        b5 = a5.answer;
    }

    d5('bot', b5, '系统');

    const c5 = document.getElementById('chat-messages');
    c5.scrollTop = c5.scrollHeight;
}

function d5(e5, f5, g5) {
    const h5 = document.getElementById('chat-messages');
    const i5 = new Date();
    const j5 = `${i5.getHours().toString().padStart(2, '0')}:${i5.getMinutes().toString().padStart(2, '0')}:${i5.getSeconds().toString().padStart(2, '0')}`;

    const k5 = document.createElement('div');
    k5.className = `message ${e5}`;
    k5.innerHTML = `
        <div class="message-header">
            <span class="sender">${g5}</span>
            <span class="time">${j5}</span>
        </div>
        <div class="message-content">${f5}</div>
    `;

    h5.appendChild(k5);

    h5.scrollTop = h5.scrollHeight;
}

const l5 = document.getElementById('theme-toggle');
const m5 = window.matchMedia('(prefers-color-scheme: dark)');

function n5(o5) {
    if (o5) {
        document.body.classList.add('dark-mode');
        l5.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        l5.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', o5 ? 'dark' : 'light');
}

let p5 = localStorage.getItem('theme');
if (p5 === 'dark') {
    n5(true);
} else if (p5 === 'light') {
    n5(false);
} else {
    n5(m5.matches);
}

l5.addEventListener('click', () => {
    const o5 = !document.body.classList.contains('dark-mode');
    n5(o5);
});

m5.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        n5(e.matches);
    }
});