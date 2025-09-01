import { Assets } from 'premid'

const presence = new Presence({
  clientId: '1410544296981041222',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

enum ActivityAssets { // Other default assets can be found at index.d.ts
  Logo = 'https://is5-ssl.mzstatic.com/image/thumb/Purple114/v4/92/eb/b7/92ebb728-6900-9f9b-e903-c35fefefe4a9/source/512x512bb.jpg',
}

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    largeImageKey: ActivityAssets.Logo,
    startTimestamp: browsingTimestamp,
  }
  const urlpath = document.location.pathname.split('/')

  if (urlpath[1] === 'puzzles') {
    if (urlpath[2] === 'puzzle') {
      const puzzleTitle = document.querySelector<HTMLMetaElement>('[class="hangboard__game"]')?.textContent || 'unknown puzzle'
      presenceData.details = 'Solving a puzzle'
      presenceData.state = puzzleTitle
      presence.setActivity(presenceData)
    }
    else {
      presenceData.details = 'Browsing Telegraph Puzzles'
      presenceData.state = 'At the homepage'
      presence.setActivity(presenceData)
    }
  }
  else {
    presence.clearActivity()
  }
})
