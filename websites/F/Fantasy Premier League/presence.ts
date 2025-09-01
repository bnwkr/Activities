import { Assets } from 'premid'

const presence = new Presence({
  clientId: '1412099108164075663',
})

enum ActivityAssets { // Other default assets can be found at index.d.ts
  Logo = 'https://i.imgur.com/D4nwAAM.jpeg',
}

const browsingTimestamp = Math.floor(Date.now() / 1000)

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    largeImageKey: ActivityAssets.Logo,
    name: 'FPL',
    startTimestamp: browsingTimestamp,
  }
  const urlpath = document.location.pathname.split('/')
  const setting = {
    showButtons: await presence.getSetting<boolean>('showButtons'),
  }

  if (setting.showButtons) {
    presenceData.buttons = [
      {
        label: 'Visit Homepage',
        url: 'https://fantasy.premierleague.com/',
      },
    ]
  }

  if (!urlpath[1]) {
    presenceData.details = 'Homepage'
    presenceData.state = 'Viewing league status'
  }
  if (urlpath[1] === 'my-team') {
    const teamPoints = document.querySelector<HTMLMetaElement>('[class="rd5cco6"]')?.textContent
    presenceData.details = 'Viewing my team'
    if (teamPoints) {
      presenceData.state = `Overall points: ${teamPoints}`
    }
    else {
      presenceData.state = 'No overall points'
    }
  }
  if (urlpath[1] === 'entry') {
    const teamPoints = document.querySelector<HTMLMetaElement>('[class="rd5cco6"]')?.textContent
    const teamName = document.querySelector<HTMLMetaElement>('[class="_1iy1znb1"]')?.textContent
    presenceData.details = `Viewing team: ${teamName ?? 'No team name'}`
    if (teamPoints) {
      presenceData.state = `Overall points: ${teamPoints}`
    }
    else {
      presenceData.state = 'No overall points'
    }
  }
  if (urlpath[1] === 'transfers') {
    presenceData.details = 'Making transfers'
  }
  if (urlpath[1] === 'leagues') {
    if (!urlpath[2]) {
      presenceData.details = 'Viewing leagues'
      presenceData.state = 'Viewing league status'
    }
    else {
      const leagueName = document.querySelector<HTMLMetaElement>('[class="y4h0qq0"]')?.textContent
      presenceData.details = 'Viewing league'
      presenceData.state = `${leagueName ?? 'No league name'}`
    }
  }
  presence.setActivity(presenceData)
})
