### Anatomy of a good prompt

The keyword categories are:
subject, medium, style, artist, website, resolution, additional details, color, lighting

some values for the categories:
https://stable-diffusion-art.com/how-to-come-up-with-good-prompts-for-ai-image-generation#Some_good_keywords_for_you

### negative prompts

### how to make a good prompt

It's an iterative process. Start light.
(keyword: factor) for adjusting the weight of a prompt.
(keyword) increases the strength of the keyword by a factor of 1.1 and is the same as (keyword:1.1)
[keyword] decrease the strength by a factor of 0.9 and is the same as (keyword:0.9)

Keyword blending by scheduling:
ex. Oil painting portrait of [Joe Biden: Donald Trump: 0.5]

**important rule for keyword blending:**
The first keyword dictates the global composition. The later refine the details.
using SD without prompts: unconditioned/unguided diffusion

## Reddit SD Prompt Series

Notes from the blog series by https://www.reddit.com/r/StableDiffusion/comments/10yn8y7/lets_make_some_realistic_humans_tutorial/.

wayback machine: https://web.archive.org/web/20230306203812/https://www.reddit.com/r/StableDiffusion/comments/10yn8y7/lets_make_some_realistic_humans_tutorial/

Different seeds really matter... Especially for color.

base prompt for experimenting: photo, woman, portrait, standing, young, age 30, VARIABLES

**age**: use "age x" instead of "x years old"

**hair color**:
use the Fischer-Saller hair color scale.
rainbow colors: red,orange,yellow,green,blue,purple,pink

**hair styles**:
short hair,medium hair,long hair,very long hair,very short hair,straight hair,curly hair,wavy hair,assymetrical hair,undercut,bob cut,hime cut, hair over shoulder, hair over one eye,shiny hair,floating hair,wet hair,messy hair,spiked hair,sidelocks,bangs,hair between eyes,blunt bangs,parted bangs,ponytail,hair bun,braid

**skin color**:
light,pale white,white,fair,medium white,light brown,olive,moderate brown,brown,dark brown,very dark brown,black

**weights and body shapes**:
fat,large,overweight,obese,stout,stocky,paunchy,big-boned,chubby,plump,podgy,curvy,flabby,thin,small,slender,slim,lanky,skinny,slight,petite,muscular,beefy,buff,burly,broad,well-built,ripped,gangly,stopped,endomorph,mesomorph,ectomorph

words to avoid that generate nsfw:

**emotions**:
happy,smiling,grinning,sad,frowning,pouting,crying,angry,scowling,glaring,surprised,gasping,wide eyes,open mouth,afraid,raised eyebrows,disgusted,wrinkled nose,upper lip raised,contempt,smirking,ashamed,downcast eyes,lowered head,embarrassed,blushing,smile with lips pressed together,excited,flushed face,confused,furrowed brow,tilted head,curious,interested,nodding,leaning forward,bored,yawning,staring blankly,concentrating,knitted brow,squinted eyes,skeptical,amused,chuckling,disapproving,shaking head,nervous,biting lip,fidgeting,relaxed,soft gaze

**eyes**:
blue eyes,red eyes,brown eyes,green eyes,purple eyes,yellow eyes,pink eyes,black eyes,aqua eyes,orange eyes,grey eyes,glowing eyes,multicolored eyes,one eye closed,looking away

**nose**:
normal nose,dot nose, pointy nose,big nose,long nose,no nose,scar on nose,nose ring,clown nose,

**clothing**:
General:
dress,sweater,jacket,cardigan,blouse,t-shirt,tank top,hoodie,sweatshirt

More specific:
square neck flounde short sleeve shirred ruffle hem dress,cropped turtleneck sweater lantern sleeve ribbed knit pullover sweater jumper,lightweight long-sleeve water-resistant puffer jacket,casual long sleeve draped open front knit pockets long cardigan jackets sweater,elegant floral print petal cap sleeve pleated vacation office work blouse top,classic-fit short-sleeve v-neck t-shirt,slim-fit thin strap tank,casual hoodies pullover tops drawstring long sleeve sweatshirts fall clothes with pocket,casual long sleeve color block solid tops crewneck sweatshirts cute loose fit pullovers with pockets

**settings**:
park,beach,shop,kitchen,city,library,restaurant,sunrise,sunset,night,starry sky,cloudy sky,rain,rainbow,sunlight,wind,snowing,forest,autumn forest,snow forest,rain forest

## Creating characters and scenes

Notes from https://web.archive.org/web/20221206071124/https://www.reddit.com/r/StableDiffusion/comments/z7pbjn/tutorial_creating_characters_and_scenes_with/.

End goal: to design repeatable characters that can be used in a wide variety of settings.

Recommends to determine a style to use as the core of the prompt, e.g: `high detailed, style of ghost blade, ultra - realistic painting, by WLOP.` .

**Observations**:

- if person is blonde, very difficult to get away from blue eyes.
- if brown hair, works kind of but e.g "purple eyes" will make other parts of the image purple aswell.
- can inpaint eyes to change color.

### Combine all different charactheristic to create "persons"

**Base structure**: Hair color, Hairstyle, Eyes, Ears, Skin, Body Modifier, Emotion, Pose, Setting

Notes from https://mythicalai.substack.com/p/how-to-create-consistent-characters.

## Simple trick to get consistent characters in SD

Notes from https://www.reddit.com/r/StableDiffusion/comments/zv5mbq/simple_trick_i_use_to_get_consistent_characters/

Do a gender and ethnicity swap.
**Example for woman->man**:
prompt: `[man: Scarlett Johansen: 0.5] as a 25 year old asian male, smiling, stunningly beautiful, zeiss lens, half length shot, ultra realistic, octane render, 8k`
negative prompt: `female,women`
