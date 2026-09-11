from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import math,re
OUT=Path('assets/ip/ai-generated');OUT.mkdir(parents=True,exist_ok=True)
def font(sz,b=False):
 p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if b else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';return ImageFont.truetype(p,sz)
def brand(fn,label,kind,color):
 im=Image.new('RGBA',(256,256),(0,0,0,0));d=ImageDraw.Draw(im);cx,cy=128,92
 if kind=='rings':
  [d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=color,width=10) for r in (52,36,20)]
 elif kind=='burst':
  [d.line((cx+22*math.cos(math.radians(a)),cy+22*math.sin(math.radians(a)),cx+58*math.cos(math.radians(a)),cy+58*math.sin(math.radians(a))),fill=color,width=11) for a in range(0,360,30)]
 elif kind=='diamond': d.polygon([(128,28),(192,92),(128,156),(64,92)],fill=color)
 elif kind=='wave': d.arc((58,30,198,154),0,180,fill=color,width=16);d.arc((58,30,198,154),180,360,fill=color,width=16)
 elif kind=='q': d.rounded_rectangle((62,32,194,154),24,outline=color,width=14);d.line((151,125,196,169),fill=color,width=14)
 elif kind=='k': d.rounded_rectangle((60,30,196,154),28,fill=color);d.text((100,54),'K',font=font(62,True),fill='white')
 elif kind=='loop': d.ellipse((50,38,136,130),outline=color,width=16);d.ellipse((120,38,206,130),outline=color,width=16)
 elif kind=='blocks':
  for x,y,w,h in [(58,35,44,44),(108,35,90,44),(58,85,90,44),(154,85,44,44)]: d.rounded_rectangle((x,y,x+w,y+h),8,fill=color)
 bb=d.textbbox((0,0),label,font=font(23,True));d.text(((256-(bb[2]-bb[0]))/2,184),label,font=font(23,True),fill=(28,34,45,255));im.save(OUT/fn,optimize=True)
def tool(fn,label,symbol):
 im=Image.new('RGBA',(256,256),(0,0,0,0));d=ImageDraw.Draw(im);d.rounded_rectangle((34,26,222,170),30,fill=(242,247,255,255),outline=(94,145,255,255),width=6);bb=d.textbbox((0,0),symbol,font=font(52,True));d.text(((256-(bb[2]-bb[0]))/2,61),symbol,font=font(52,True),fill=(35,100,245,255));bb=d.textbbox((0,0),label,font=font(21,True));d.text(((256-(bb[2]-bb[0]))/2,191),label,font=font(21,True),fill=(28,34,45,255));im.save(OUT/fn,optimize=True)
brands=[('ai-logo-chatgpt.png','ChatGPT','rings',(16,163,127,255)),('ai-logo-claude.png','Claude','burst',(218,103,74,255)),('ai-logo-gemini.png','Gemini','diamond',(80,105,255,255)),('ai-logo-deepseek.png','DeepSeek','wave',(29,99,237,255)),('ai-logo-qwen.png','Qwen','q',(99,70,255,255)),('ai-logo-kimi.png','Kimi','k',(20,20,24,255)),('ai-logo-copilot.png','Copilot','loop',(68,97,242,255)),('ai-logo-mistral.png','Mistral','blocks',(255,126,27,255))]
tools=[('ai-tool-rag.png','RAG','R'),('ai-tool-agent.png','Agent','A'),('ai-tool-mcp.png','MCP','M'),('ai-tool-vector-db.png','Vector DB','V'),('ai-tool-prompt.png','Prompt','P'),('ai-tool-embedding.png','Embedding','E'),('ai-tool-langchain.png','LangChain','LC'),('ai-tool-langgraph.png','LangGraph','LG')]
for x in brands: brand(*x)
for x in tools: tool(*x)
static=["{id:'host-thinking',name:'host-thinking.png',cat:'host',path:'./assets/ip/xiaohieyun-test/host-thinking.png?v=3',raw:'assets/ip/xiaohieyun-test/host-thinking.png'}","{id:'host-welcome',name:'host-welcome.png',cat:'host',path:'./assets/ip/xiaohieyun-test/host-welcome.png?v=2',raw:'assets/ip/xiaohieyun-test/host-welcome.png'}"]
for fn,*_ in brands:
 i=fn[:-4];static.append("{id:'%s',name:'%s',cat:'ai-logo',path:'./assets/ip/ai-generated/%s',raw:'assets/ip/ai-generated/%s'}"%(i,fn,fn,fn))
for fn,*_ in tools:
 i=fn[:-4];static.append("{id:'%s',name:'%s',cat:'ai-tool',path:'./assets/ip/ai-generated/%s',raw:'assets/ip/ai-generated/%s'}"%(i,fn,fn,fn))
defaults="[{id:'host',name:'角色动作'},{id:'machine',name:'机器元素'},{id:'prop',name:'道具物品'},{id:'metaphor',name:'概念图'},{id:'card',name:'卡片素材'},{id:'ai-logo',name:'AI Logo'},{id:'ai-tool',name:'AI 工具图标'}]"
p=Path('ip.html');html=p.read_text();new="const staticAssets=["+','.join(static)+"];const defaults="+defaults+";let categories=";html,n=re.subn(r"const staticAssets=\[.*?\];const defaults=\[.*?\];let categories=",new,html,count=1,flags=re.S);assert n==1,'ip.html asset block not found';html=html.replace("v1.5","v1.6",1);p.write_text(html)
print('generated',len(list(OUT.glob('*.png'))),'PNGs and registered them in ip.html')
