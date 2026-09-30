const visionTrials=[
 {label:'光线充足',item:{type:'drone'},score:96,note:'画面清晰、光线充足，小 A 找到了无人机的旋翼和机身。'},
 {label:'部分遮挡',item:{type:'drone',occluded:true},score:61,note:'树枝挡住了部分机身，小 A 只能根据剩余轮廓做判断。'},
 {label:'夜间画面',item:{type:'drone',night:true},score:42,note:'光线太暗，关键轮廓不清晰，小 A 没能可靠地认出无人机。'},
 {label:'远距离画面',item:{type:'drone',remote:true},score:28,note:'无人机离得太远，在图片里占比很小，细节难以辨认。'}
];

function startVisionMission(){
 currentMission=1;currentStep=0;stage='vision';accuracy=0;$('#feedback').textContent='';
 $('#missionIndex').textContent='02';$('#missionCategory').textContent='COMPUTER VISION';
 $('#missionTitle').textContent='同一架无人机，为什么有时认不出来？';
 $('#missionDesc').textContent='小 A 已经学会了无人机。现在用 4 张演示图片测试它：光线、遮挡和距离会怎样影响识别？';
 $('#missionCrumb').textContent='02 机器视觉实验室';$('#stepLabel').textContent='01 / 01';
 $('#stepDots').innerHTML='<i class="done"></i>';
 $('#hintText').textContent='逐张点击图片，查看演示模型的识别信心和原因；检查完 4 张后即可完成实验。';
 $('#asideChat').textContent='“我认识无人机！不过画面变暗或被挡住时，我还认得出来吗？”';
 $('#conceptCopy').textContent='本关用预设结果模拟图像识别。真实模型会从图片特征中判断物体，光线、遮挡和距离都会改变可用线索。';
 $('#actionBtn').disabled=true;$('#actionBtn').textContent='先检查 4 种画面';
 $('#playArea').innerHTML=`<div class="area-head"><span>✦&nbsp; 视觉实验 / 演示数据：同一目标，不同环境</span><span class="sample-counter"><b id="visionCount">0</b> / 4 已检查</span></div><div class="step-instruction"><b>实验任务</b><span>依次点开 4 张演示图片，观察模拟识别信心的变化。达到 60% 表示这组演示模型认出了无人机。</span></div><div class="vision-cards">${visionTrials.map((trial,i)=>`<button class="vision-card" data-vision="${i}" aria-label="${trial.label}的无人机图片，点击查看演示识别结果"><img src="${photoSrc(trial.item,i)}" alt="${trial.label}下的无人机"><span class="vision-card-label">${trial.label}</span><span class="vision-result">点击查看演示结果</span><span class="vision-bar"><i></i></span></button>`).join('')}</div><div class="vision-summary" id="visionSummary" hidden></div>`;
 let checked=new Set();
 $$('.vision-card').forEach(card=>card.addEventListener('click',()=>{const i=Number(card.dataset.vision);if(checked.has(i))return;checked.add(i);const trial=visionTrials[i],recognized=trial.score>=60;card.classList.add('checked',recognized?'recognized':'missed');card.querySelector('.vision-result').textContent=`${recognized?'认出':'没认出'} · ${trial.score}%`;card.querySelector('.vision-bar i').style.width=`${trial.score}%`;card.insertAdjacentHTML('beforeend',`<span class="vision-note">${trial.note}</span>`);$('#visionCount').textContent=checked.size;$('#asideChat').textContent=trial.note;$('#hintText').textContent=checked.size<4?`已检查 ${checked.size} / 4 张，继续观察不同环境带来的变化。`:'4 种画面都检查完了，看看实验结论后点击“完成视觉实验”。';if(checked.size===4){const recognizedCount=visionTrials.filter(x=>x.score>=60).length;accuracy=Math.round(recognizedCount/visionTrials.length*100);$('#visionSummary').hidden=false;$('#visionSummary').innerHTML=`<b>实验发现</b><span>小 A 认出了 ${recognizedCount} / 4 种画面。光线、遮挡和距离会改变图像中的线索，影响识别信心。</span>`;$('#actionBtn').disabled=false;$('#actionBtn').innerHTML='完成视觉实验 <span class="btn-arrow">↗</span>'}}));
 showScreen('missionScreen');
}

function completeVisionMission(){
 if(!state.done.includes(1)){state.done.push(1);state.certDates[1]=new Date().toLocaleDateString('zh-CN');state.xp+=missions[1].xp;state.trust=Math.min(100,state.trust+18);state.bestAccuracy=Math.max(state.bestAccuracy,accuracy);saveState()}
 $('#resultTitle').textContent='视觉实验完成！';$('#resultCopy').textContent='你发现了光线、遮挡和距离会影响 AI 的判断。给模型更多样的训练图片，能帮助它应对不同环境。';
 $('#resultXP').textContent=`+${missions[1].xp} XP`;
 $('#resultSkill').textContent='图像识别';$('#resultCity').textContent='+9%';
 $('#resultBadge').querySelector('b').textContent='视觉观察员';
 $('#resultBadge').querySelector('small').textContent='新获得徽章';
 $('#nextBtn').innerHTML='领取本关证书 <span class="btn-arrow">↗</span>';showScreen('resultScreen');
}

const biasTrials=[
 {label:'白天、近距离',item:{type:'drone'},score:96,note:'训练图片里常见这种清晰的白天画面，所以小 A 很有把握。'},
 {label:'夜间、近距离',item:{type:'drone',night:true},score:38,note:'训练样本几乎没有夜间图片，光线一变，小 A 就容易判断错。'},
 {label:'白天、远距离',item:{type:'drone',remote:true},score:64,note:'虽然是白天，但目标很小，缺少细节让小 A 犹豫。'},
 {label:'夜间、被遮挡',item:{type:'drone',night:true,occluded:true},score:21,note:'夜间又被遮挡，训练数据没有覆盖这种情况，模型信心最低。'}
];

function startBiasMission(){
 currentMission=2;currentStep=0;stage='bias';accuracy=0;$('#feedback').textContent='';
 $('#missionIndex').textContent='03';$('#missionCategory').textContent='MODEL BIAS';
 $('#missionTitle').textContent='小 A 为什么会犯错？';
 $('#missionDesc').textContent='本关的演示模型训练样本以白天画面为主。检查它在不同场景中的表现，再选出补充样本的方法。';
 $('#missionCrumb').textContent='03 AI 为什么会犯错';$('#stepLabel').textContent='01 / 01';$('#stepDots').innerHTML='<i class="done"></i>';
 $('#hintText').textContent='先逐张检查 4 张图片，再选一种改进训练数据的方法。';
 $('#asideChat').textContent='“我在白天照片上表现不错，换成夜间画面还行吗？”';
 $('#conceptCopy').textContent='本关用预设结果模拟数据偏差。训练数据不够多样时，真实模型可能只学会常见场景，对少见的人、地点或环境判断不准。';
 $('#actionBtn').disabled=true;$('#actionBtn').textContent='先检查 4 张图片';
 $('#playArea').innerHTML=`<div class="area-head"><span>✦&nbsp; 偏差实验 / 检查模型盲区</span><span class="sample-counter"><b id="biasCount">0</b> / 4 已检查</span></div><div class="step-instruction"><b>实验任务</b><span>点击每张演示图片查看预设识别信心。比较不同环境中的结果，找出训练数据没有覆盖的场景。</span></div><div class="bias-cards">${biasTrials.map((trial,i)=>`<button class="bias-card" data-bias="${i}" aria-label="${trial.label}无人机图片，点击查看演示判断"><img src="${photoSrc(trial.item,i)}" alt="${trial.label}的无人机"><b>${trial.label}</b><span class="bias-result">点击查看演示结果</span><span class="vision-bar"><i></i></span></button>`).join('')}</div><div id="biasConclusion" class="vision-summary" hidden></div><div id="biasFix" class="bias-fix" hidden><b>你会怎样改进训练数据？</b><div><button class="bias-fix-choice" data-correct="false">继续增加白天照片</button><button class="bias-fix-choice" data-correct="true">补充夜间和遮挡照片</button></div><small id="biasFeedback" aria-live="polite"></small></div>`;
 const checked=new Set();
 $$('.bias-card').forEach(card=>card.addEventListener('click',()=>{const i=Number(card.dataset.bias);if(checked.has(i))return;checked.add(i);const trial=biasTrials[i];card.classList.add('checked',trial.score>=60?'recognized':'missed');card.querySelector('.bias-result').textContent=`识别信心 ${trial.score}%`;card.querySelector('.vision-bar i').style.width=`${trial.score}%`;card.insertAdjacentHTML('beforeend',`<span class="vision-note">${trial.note}</span>`);$('#biasCount').textContent=checked.size;$('#asideChat').textContent=trial.note;$('#hintText').textContent=`已检查 ${checked.size} / 4 张。${checked.size<4?'继续检查剩余图片，比较不同场景。':'检查完成后，选择能弥补数据缺口的方法。'}`;if(checked.size===4){accuracy=Math.round(biasTrials.filter(x=>x.score>=60).length/4*100);$('#biasConclusion').hidden=false;$('#biasConclusion').innerHTML='<b>实验发现</b><span>小 A 在白天画面上更有把握，夜间表现明显下降。它偏向训练数据里常见的白天场景。</span>';$('#biasFix').hidden=false}}));
 $$('.bias-fix-choice').forEach(button=>button.addEventListener('click',()=>{const right=button.dataset.correct==='true';$$('.bias-fix-choice').forEach(x=>x.classList.remove('selected','correct','wrong'));button.classList.add('selected',right?'correct':'wrong');$('#biasFeedback').textContent=right?'回答正确！补充多种环境的样本，能让模型学得更全面。':'再想想：问题出在夜间样本太少，继续增加白天照片能补上这个缺口吗？';$('#actionBtn').disabled=!right;$('#actionBtn').innerHTML=right?'完成本关 <span class="btn-arrow">↗</span>':'选择正确的方法后继续'}));
 showScreen('missionScreen');
}

function completeBiasMission(){
 if(!state.done.includes(2)){state.done.push(2);state.certDates[2]=new Date().toLocaleDateString('zh-CN');state.xp+=missions[2].xp;state.trust=Math.min(100,state.trust+18);state.bestAccuracy=Math.max(state.bestAccuracy,accuracy);saveState()}
 $('#resultTitle').textContent='偏差分析完成！';$('#resultCopy').textContent='你发现这组演示数据缺少夜间画面，并选出了改进方向。实际训练模型时，应补充不同光线和遮挡条件下的样本。';
 $('#resultXP').textContent=`+${missions[2].xp} XP`;$('#resultSkill').textContent='发现并修复偏差';$('#resultCity').textContent='+9%';
 $('#resultBadge').querySelector('b').textContent='数据守护员';$('#resultBadge').querySelector('small').textContent='新获得徽章';$('#nextBtn').innerHTML='领取本关证书 <span class="btn-arrow">↗</span>';showScreen('resultScreen');
}

const extraMissionData={
 3:{category:'PROMPT DESIGN',title:'拼出一条清晰的提示词',description:'提示词像任务说明。把任务、背景、要求和格式说清楚，小 A 才更容易给出有用的回答。',skill:'提示词设计',badge:'提示词设计师',intro:'值班员需要一份清楚、可靠的夜间无人机告警摘要。一步步补齐提示词。',buildSlots:['任务','背景','要求','格式'],tasks:[
  {question:'先告诉小 A 要做什么。',options:[{text:'总结这条无人机告警。',correct:true,summary:'总结无人机告警',why:'任务要明确，让小 A 知道要完成什么。'},{text:'随便写点关于未来城的内容。',why:'范围太宽，小 A 不知道该处理哪件事。'}]},
  {question:'补充必要背景。',options:[{text:'告警来自北门夜间巡逻，画面有些模糊。',correct:true,summary:'背景：北门夜巡，画面模糊',why:'背景能帮助小 A 理解告警发生的场景。'},{text:'未来城有很多建筑和道路。',why:'这条信息和当前告警关系不大。'}]},
  {question:'加上可靠性要求。',options:[{text:'只依据提供的记录；不确定时明确说明。',correct:true,summary:'要求：只用记录，不确定就说明',why:'这能减少编造信息，也让不确定之处更清楚。'},{text:'为了完整，可以补充没有记录的细节。',why:'没有依据的细节可能让报告变得不可靠。'}]},
  {question:'最后指定回答格式。',options:[{text:'用 3 条要点写出发现、依据和建议。',correct:true,summary:'格式：3 条要点（发现、依据、建议）',why:'清楚的格式要求能让结果更容易阅读和核对。'},{text:'写得越长越好，不用分段。',why:'这不利于值班员快速查看重点。'}]}
 ]},
 4:{category:'FACT CHECK',title:'找出告警里的不实说法',description:'一条群聊消息说“所有夜间无人机都无法识别”。查看实验记录，判断这句话有没有足够证据。',skill:'信息核查',badge:'事实核查员',intro:'“所有夜间无人机都无法识别”听起来很绝对。我们一起检查原始记录。',brief:'<div class="extra-evidence"><b>待核查说法</b><p>“所有夜间无人机都无法识别。”</p><div><span>实验记录：本次夜间图片识别信心 42%</span><span>识别参考线：60%</span><span>本次记录：1 张夜间图片</span></div></div>',tasks:[
  {question:'哪条信息最适合当作核查依据？',options:[{text:'原始实验记录里的 42% 识别信心。',correct:true,why:'原始记录能直接说明这次测试的结果。'},{text:'群聊里很多人转发了这句话。',why:'转发次数不能证明内容真实。'}]},
  {question:'42% 低于 60% 说明什么？',options:[{text:'这张测试图片没有达到识别标准。',correct:true,why:'它说明本次这张图的测试结果较弱。'},{text:'所有夜间无人机都一定认不出来。',why:'一次测试不能代表所有夜间图片。'}]},
  {question:'要判断模型在夜间整体表现，还需要什么？',options:[{text:'收集更多不同夜间场景的图片并重复测试。',correct:true,why:'更多样的样本才能支持更全面的结论。'},{text:'只重复查看这一张图片。',why:'同一张图片不能覆盖不同距离、天气和角度。'}]},
  {question:'哪种结论最符合现有证据？',options:[{text:'本次夜间样例未达标准，但还不能代表所有夜间场景。',correct:true,why:'这个说法既保留了测试结果，也没有把结论夸大。'},{text:'已经证明夜间无人机永远无法识别。',why:'现有证据只有一张图，不能支持“永远”或“所有”。'}]}
 ]},
 5:{category:'MULTIMODAL AI',title:'合并文字、图像和声音线索',description:'北门的送货机器人没有按时回来。把文字、摄像头画面和录音线索放在一起，找出最合理的情况。',skill:'多模态分析',badge:'多模态观察员',intro:'单看一种线索不一定够。我们一起听、看、读，再综合判断。',brief:'<div class="extra-modalities"><div><b>文字记录</b><span>“送货机器人停在北门附近。”</span></div><div><b>摄像头画面</b><span>📦　🤖　🧱<br>包裹车旁有一块倒下的挡板。</span></div><div><b>录音线索</b><button class="audio-clue-btn" id="playAudioClue">▶ 播放语音</button><span>转写：“前方被挡住了，请求帮助。”</span></div></div>',tasks:[
  {question:'综合三种线索，最合理的判断是什么？',options:[{text:'送货机器人被挡板拦在北门附近，需要先清理通道。',correct:true,why:'文字、画面和录音都指向北门的障碍物。'},{text:'机器人已经把包裹送到南门，可以结束任务。',why:'没有任何线索提到南门或成功送达。'},{text:'只根据录音判断机器人已经损坏。',why:'录音说的是被挡住了，没有证据说明设备损坏。'}]},
  {question:'如果摄像头画面看不清，下一步该怎么做？',options:[{text:'结合文字和录音，并标记画面仍需确认。',correct:true,why:'多种线索可以互相补充；看不清的部分要如实说明。'},{text:'忽略其他线索，猜测画面里的内容。',why:'不应把猜测当成已经确认的事实。'}]},
  {question:'哪种做法最能避免误报？',options:[{text:'确认各条线索指向同一时间和地点，再给出结论。',correct:true,why:'核对时间与地点，可以避免把不同事件的线索混在一起。'},{text:'只要有一条线索出现，就马上宣布任务完成。',why:'单条线索不足以证明机器人已经送达或安全。'}]}
 ]},
 6:{category:'AI AGENT',title:'为小 A 安排安全行动计划',description:'目标：把急救包送到北门。选出合理的行动顺序，让小 A 先核实信息、再调用工具，并在执行前确认。',skill:'Agent 任务规划',badge:'行动规划师',intro:'我可以规划步骤，也能使用地图工具。涉及真实行动时，我会先征求你的确认。',brief:'<div class="extra-goal"><b>行动目标</b><p>把急救包安全送到北门，并向你报告结果。</p><span>可用工具：路线地图 · 送货机器人</span></div>',tasks:[
  {question:'第一步应该做什么？',options:[{text:'确认急救包内容、目的地和当前任务要求。',correct:true,why:'先弄清目标和限制，避免从错误的任务开始。'},{text:'立刻让机器人出发，再问它要送什么。',why:'执行前应先核实任务信息。'}]},
  {question:'信息确认后，小 A 应该怎样规划路线？',options:[{text:'调用路线地图，检查通道和安全路线。',correct:true,why:'使用合适的工具获取路线信息，再决定下一步。'},{text:'凭印象选一条路，不查看地图。',why:'没有核实路线，可能遇到封路或危险。'}]},
  {question:'机器人即将出发前，哪种做法更安全？',options:[{text:'把路线和任务告诉你，等你确认后再出发。',correct:true,why:'会产生现实影响的操作，应先让人确认。'},{text:'跳过确认，直接发送出发指令。',why:'执行外部行动前需要确认授权。'}]},
  {question:'机器人完成或遇到障碍后，小 A 应该做什么？',options:[{text:'核实执行结果，再向你报告成功或遇到的问题。',correct:true,why:'Agent 需要检查结果并如实反馈，不能只发出指令。'},{text:'不检查结果，直接说任务成功。',why:'没有结果证据时不能宣称完成。'}]}
 ]},
 7:{category:'FINAL MISSION',title:'修复未来城 AI 中枢',description:'综合运用数据、视觉、核查、多模态和 Agent 规划知识，处理一条紧急无人机告警。',skill:'综合行动',badge:'未来城守护者',intro:'中枢收到一条紧急告警。一步步分析证据、制定安全方案，完成最终任务。',brief:'<div class="extra-final"><b>最终任务</b><p>北门夜间告警：画面模糊、目标被部分遮挡。系统消息声称“无人机正冲向人群”，但暂时没有其他证据。</p></div>',tasks:[
  {question:'首先怎样检查告警目标？',options:[{text:'查看原始图片和已标注样本，留意夜间与遮挡影响。',correct:true,why:'数据样本和画面条件会影响识别，先检查线索来源。'},{text:'只凭模糊画面，立刻认定目标就是无人机。',why:'模糊和遮挡会降低识别可靠性。'}]},
  {question:'系统说“正冲向人群”，但没有提供依据，怎么办？',options:[{text:'核对原始记录和其他线索，暂不把未证实说法当事实。',correct:true,why:'重要结论要有证据支持，不能照单全收。'},{text:'把系统消息直接转发为已确认事实。',why:'未核实的信息可能造成误报。'}]},
  {question:'文字、图像和声音线索应如何使用？',options:[{text:'对照它们的时间、地点和内容，确认是否相互印证。',correct:true,why:'多模态信息要结合起来，同时检查是否属于同一事件。'},{text:'只选最吓人的一条线索作为结论。',why:'单独挑选一条线索会忽略相互矛盾的信息。'}]},
  {question:'如果需要派出机器人，最后一步是什么？',options:[{text:'先制定路线并向你说明风险，得到确认后再执行并核实结果。',correct:true,why:'安全的 Agent 会规划、征求确认、执行并检查结果。'},{text:'不经确认就派出机器人，并默认任务成功。',why:'外部行动需要授权，结果也必须核实。'}]}
 ]}
};

let extraMissionIndex=3,extraTaskIndex=0,extraPassed=[],extraLocked=false;

function startExtraMission(index){
 const mission=extraMissionData[index];if(!mission){toast('这一关暂时没有行动内容，请回到地图重试。');return}
 currentMission=index;currentStep=0;extraMissionIndex=index;extraTaskIndex=0;extraPassed=[];stage='extra';accuracy=100;extraLocked=false;
 $('#feedback').textContent='';$('#missionIndex').textContent=String(index+1).padStart(2,'0');$('#missionCategory').textContent=mission.category;$('#missionTitle').textContent=mission.title;$('#missionDesc').textContent=mission.description;$('#missionCrumb').textContent=`${String(index+1).padStart(2,'0')} ${missions[index].title}`;$('#asideChat').textContent=`“${mission.intro}”`;$('#conceptCopy').textContent='每一步先看清目标和线索，再选择有依据、可验证的做法。';renderExtraTask();showScreen('missionScreen');
}

function renderExtraTask(){
 const mission=extraMissionData[extraMissionIndex],task=mission.tasks[extraTaskIndex],total=mission.tasks.length;
 $('#stepLabel').textContent=`${String(extraTaskIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
 $('#stepDots').innerHTML=Array.from({length:total},(_,i)=>`<i class="${i<=extraTaskIndex?'done':''}"></i>`).join('');
 $('#hintText').textContent=`第 ${extraTaskIndex+1} 步 / ${total}：${extraLocked?'点击“继续行动”进入下一步。':'选择你认为最合适的做法。答错可以重新选择。'}`;
 $('#actionBtn').disabled=true;$('#actionBtn').textContent='先选择一个答案';$('#feedback').textContent='';
 const scene=mission.brief?`<div class="extra-scene">${mission.brief}</div>`:'';
 const build=mission.buildSlots?`<div class="extra-build"><b>正在组装提示词</b><p>${mission.buildSlots.map((slot,i)=>`<span><em>${slot}</em>${extraPassed[i]?.summary||'待补充'}</span>`).join('')}</p></div>`:'';
 $('#playArea').innerHTML=`<div class="area-head"><span>✦&nbsp; ${missions[extraMissionIndex].title} / 行动步骤</span><span class="sample-counter">${String(extraTaskIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span></div><div class="step-instruction"><b>你的任务</b><span>${task.question}</span></div>${scene}${build}<div class="extra-options">${task.options.map((option,i)=>`<button class="extra-option" data-option="${i}"><span class="extra-option-mark">${String.fromCharCode(65+i)}</span><span>${option.text}</span></button>`).join('')}</div>`;
 if(extraMissionIndex===5){const audioButton=$('#playArea').querySelector('#playAudioClue');if(audioButton)audioButton.addEventListener('click',()=>{if('speechSynthesis' in window){window.speechSynthesis.cancel();window.speechSynthesis.speak(new SpeechSynthesisUtterance('前方被挡住了，请求帮助。'))}else toast('语音播放不可用，请阅读录音转写。')})}
 $$('.extra-option').forEach(button=>button.addEventListener('click',()=>chooseExtraOption(button,task)));
}

function chooseExtraOption(button,task){
 if(extraLocked)return;const option=task.options[Number(button.dataset.option)];
 if(!option.correct){button.classList.add('wrong');$('#feedback').textContent=option.why||'再想一想，找一个更符合线索的选项。';$('#asideChat').textContent='“这个办法可能不够可靠。我们再检查一下线索吧。”';return}
 extraLocked=true;button.classList.add('correct');$$('.extra-option').forEach(x=>x.disabled=true);extraPassed[extraTaskIndex]=option;const mission=extraMissionData[extraMissionIndex],build=$('.extra-build');if(build&&mission.buildSlots)build.innerHTML=`<b>正在组装提示词</b><p>${mission.buildSlots.map((slot,i)=>`<span><em>${slot}</em>${extraPassed[i]?.summary||'待补充'}</span>`).join('')}</p>`;$('#feedback').textContent=option.why||'选择正确！';$('#asideChat').textContent='“做得好！这一步有依据，也更可靠。”';$('#hintText').textContent='回答正确。查看说明后，点击按钮继续。';$('#actionBtn').disabled=false;$('#actionBtn').innerHTML=extraTaskIndex===mission.tasks.length-1?'完成本关 <span class="btn-arrow">↗</span>':'继续行动 <span class="btn-arrow">↗</span>';
}

function advanceExtraMission(){
 if(!extraLocked)return;const tasks=extraMissionData[extraMissionIndex].tasks;
 if(extraTaskIndex<tasks.length-1){extraTaskIndex++;extraLocked=false;renderExtraTask();return}
 completeExtraMission();
}

function completeExtraMission(){
 const mission=extraMissionData[extraMissionIndex];
 if(!state.done.includes(extraMissionIndex)){state.done.push(extraMissionIndex);state.certDates[extraMissionIndex]=new Date().toLocaleDateString('zh-CN');state.xp+=missions[extraMissionIndex].xp;state.trust=Math.min(100,state.trust+18);state.bestAccuracy=Math.max(state.bestAccuracy,100);saveState()}
 $('#resultTitle').textContent=`${missions[extraMissionIndex].title}完成！`;
 $('#resultCopy').textContent=extraMissionIndex===7?'你整合了数据、视觉、核查、多模态和安全规划方法，完成未来城中枢的最终行动。':`你完成了「${missions[extraMissionIndex].title}」行动，并掌握了${mission.skill}的基本方法。`;
 $('#resultXP').textContent=`+${missions[extraMissionIndex].xp} XP`;$('#resultSkill').textContent=mission.skill;$('#resultCity').textContent='+9%';
 $('#resultBadge').querySelector('b').textContent=mission.badge;$('#resultBadge').querySelector('small').textContent='新获得徽章';$('#nextBtn').innerHTML='领取本关证书 <span class="btn-arrow">↗</span>';showScreen('resultScreen');
}
