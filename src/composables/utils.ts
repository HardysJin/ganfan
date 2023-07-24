// import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'

import { defineStore } from 'pinia'

export const globalStore = defineStore('global_store', () => {
  const checked_meals = ref([])
  const [mealinfos, meals_priceRefs] = loadMeals()
  const user = getUser()
  const login = ref(user.value._id === null)
  const bill_table = ref(null)
  return { checked_meals, meals_priceRefs, mealinfos, user, login, bill_table }
})

function getUser() {
  const theDefaultUser = {
    _id: null,
    name: null,
    isAdmin: false,
  }
  const state = useStorage('user', theDefaultUser)
  return state
}

function loadMeals() {
  const mealinfos = ref(null)
  const meals_priceRefs = {}

  console.log(`${import.meta.env.VITE_BASE_URL}/api/meals`)
  fetch(`${import.meta.env.VITE_BASE_URL}/api/meals`)
    .then(response => response.json())
    .then((data) => {
      // console.log(data)
      // Object.keys(data).forEach((key) => {
      //   data[key].date = new Date(data[key].date)
      // });
      console.log(data)

      data.map(meal => meal.date = new Date(meal.date))
      data = data.sort((a, b) => b.date - a.date)
      mealinfos.value = data // Object.values(data)
    
      data.forEach((info) => {
        meals_priceRefs[info._id] = ref(info.totalFinal)
      })


      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const title = `干饭时刻 | ${data[0].restaurant} | ${data[0].date.toDateString()}`
      useHead({
        title: title,
        meta: [
          { name: 'og:title', content: title },
          { name: 'description', content: description },
          { name: 'og:description', content: description },
          { name: 'og:description', content: "https://loremflickr.com/320/240/food/all" },
          {
            name: 'theme-color',
            content: '#ffffff',
          },
        ],
        link: [
          {
            rel: 'icon',
            type: 'image/svg+xml',
            href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
          },
        ],
      })

      // console.log(Object.keys(globalStore().mealinfos)
      // .filter( key => globalStore().mealinfos[key].archive === false)
      // .reduce( (res, key) => (res[key] = globalStore().mealinfos[key], res), {} ))
      // console.log(Object.fromEntries(Object.entries(globalStore().mealinfos).filter(([_id, mealinfo]) => mealinfo.archive === false)))

      // const out = Object.keys(mealinfos.value)
      //   .filter( key => {
      //     console.log(mealinfos.value[key].archive)
      //     return mealinfos.value[key].archive === false
      //   })
      //   .reduce( (res, key) => (res[key] = mealinfos.value[key], res), {} )
      // console.log(out)
      console.log(mealinfos)
      console.log(meals_priceRefs)
    })
  return [mealinfos, meals_priceRefs]
}

export async function onClickCalculate() {
  const data = {
    meals: [],
  }

  globalStore().checked_meals.forEach((id) => {
    data.meals.push({
      _id: id,
      totalFinal: globalStore().meals_priceRefs[id],
    })
  })

  // console.log(data)

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  globalStore().bill_table = await response.json()
  // console.log(globalStore().bill_table)
}

async function updateMeal(id: string, data: object) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/meals/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const idx = globalStore().mealinfos.findIndex(info => info._id === id)
  globalStore().mealinfos[idx] = await response.json()
  // console.log( globalStore().mealinfos )
}

export async function archiveCheckedMeal() {
  globalStore().checked_meals.forEach((id) => {
    updateMeal(id, { archive: true })
  })
  globalStore().checked_meals = []
}


const descriptions = ["对于吃货来说，每天有好吃的东西，生活不会单调到哪儿去。",
"打工人也是干饭人，不过只有好好吃饭才能好好长大呀。",
"没有什么事是干饭解决不了的，如果有就干两顿。",
"大漠孤烟直，干饭不可以迟。江河入海流，食堂我最强。",
"此后余生，能让我放不下的，也就只有筷子了。",
"干饭人！食欲大！一张大嘴巴吃天下！",
"欢迎大家一起分享美食，希望大家在这个大家庭，吃好玩好。",
"要和家境相仿的人一起玩，有没有一起要饭的。",
"英雄人物不谈出處，美女干饭不谈斤数。",
"你自己搁这腥臭腐朽里熠熠生辉吧，我得干饭去了。",
"如果我没有这张嘴，玛莎拉蒂都到手了。",
"对于吃货而言，没有什么事情是碗救不了的。",
"我们要悄悄的干饭，然后饿死所有人。",
"减肥打卡，第一天就失败了，败给了美食。",
"其实我对你有一点心动，只是干饭要紧，没来得及说。",
"美女的第一快乐是干饭，其余都是锦上添花。",
"食为天性，静静地咀嚼，轻轻地回味，非比寻常的韵致。",
"不吃饭的都去参加女团了，像我这种只会干饭的只能去参加美团。",
"每天喝8杯水很难，但是干八碗饭，只需要你一句我请你吃饭。",
"在吃货这条不归路上，人类，从来都不孤单。",
"我可以不谈恋爱，可是我确实不可以少干一顿饭。",
"没有难吃的食物，只有坚强的干饭人。",
"没有难吃的食堂，只有坚强的干饭人。",
"人生只一碗面就足矣，生活因一碗面而美好。",
"干饭了干饭了，今天吃养生大青菜，不养生我不吃。",
"吃货群，进群加群主，进不了群就加群主拉你进群。",
"如果你不断的干饭，没有你追赶不上的休重，给油，干饭人！",
"永远无法叫醒一个装睡的人，但叫醒我只需要一句：干饭了。",
"假如我没有这张开嘴巴，法拉利都拿到了。",
"问：你的核心竞争力是什么？答：把所有人的饭干掉。",
"我会在那腥臭腐朽的日子里，干饭生辉。",
"授课瞌睡王，食堂干饭王，学校外快递公司王，每日一杯奶茶王。",
"只要你不停的干饭，没有你追不上的体重，加油，干饭人！",
"做高逼格的吃货，追求吃货的更高境界！",
"对象没有，但干饭总得干得过别人吧。",
"为干饭生，为干饭死，为干饭奋斗一辈子。",
"本来想去健身房，风太大，把我刮到火锅店啦。",
"干完全食堂的饭，让其他人无饭可干。",
"不吃饭的都参加女团了，我这种只会干饭的只能参加美团。",
"加油！干饭人！每天上班！多干几口零食应该不会胖吧？",
"干饭人，干饭魂，干饭人吃饭得用盆。",
"下课瞌睡王，食堂闪电狼，大家都是干饭人！",
"再简单的食物都有自己的灵魂，人生有很多味道无法复制。",
"上课瞌睡王，食堂干饭王，校外快递王，每天一杯奶茶王。",
"你不要问我在哪儿，你直接说，在哪个食堂。",]
