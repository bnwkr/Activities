import { ActivityType, Assets, getTimestampsFromMedia } from 'premid'

const presence = new Presence({
  clientId: '1408037363665338519',
})

enum ActivityAssets {
  Logo = 'https://m.media-amazon.com/images/I/61sDr8btlTL.png',
}

const browsingTimestamp = Math.floor(Date.now() / 1000)

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    largeImageKey: ActivityAssets.Logo,
    startTimestamp: browsingTimestamp,
    type: ActivityType.Watching,
  }
  const setting = {
    privacy: await presence.getSetting<boolean>('privacy'),
  }
  const urlpath = document.location.pathname.split('/')
  const video = document.querySelector<HTMLVideoElement>('video')
  const search = document.querySelector<HTMLInputElement>('[data-testid="search-input"]')

  if (setting.privacy) {
    presenceData.details = 'Watching NOW TV'
  }
  if (search) {
    presenceData.details = 'Searching for'
    presenceData.state = search.value
    presenceData.smallImageKey = Assets.Search
  }
  if (video?.duration) {
    const title = document.querySelector<HTMLMetaElement>(
      '[class="item playback-metadata__container-title"]',
    )
    const episodeDetails = document.querySelector<HTMLMetaElement>(
      '[class="item playback-metadata__container-episode-metadata-info"]',
    )

    presenceData.details = title
    presenceData.state = episodeDetails
    presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
    [presenceData.startTimestamp, presenceData.endTimestamp] = getTimestampsFromMedia(video)

    if (urlpath[3] === 'live') {
      delete presenceData.startTimestamp
      delete presenceData.endTimestamp
      presenceData.smallImageKey = Assets.Live
      presenceData.smallImageText = 'Live'
      if (!episodeDetails)
        presenceData.state = 'Watching live TV'
    }

    if (video.paused) {
      delete presenceData.startTimestamp
      delete presenceData.endTimestamp
      presenceData.smallImageKey = Assets.Pause
      presenceData.smallImageText = 'Paused'
    }
  }
  else if (!urlpath[1]) {
    presenceData.details = 'Browsing NOW TV'
  }
  else if (urlpath[2] === 'home') {
    presenceData.details = 'Browsing NOW TV'
    presenceData.state = 'Home'
  }
  else if (urlpath[2] === 'tv') {
    presenceData.details = 'Browsing Sky Entertainment'
    presenceData.state = 'Looking at TV shows'
  }
  else if (urlpath[2] === 'movies') {
    presenceData.details = 'Browsing Sky Cinema'
    presenceData.state = 'Looking at movies'
  }
  else if (urlpath[2] === 'sports') {
    presenceData.details = 'Browsing Sky Sports'
    presenceData.state = 'Looking at sports'
  }
  else if (urlpath[2] === 'hayu') {
    presenceData.details = 'Browsing Hayu'
    presenceData.state = 'Looking at TV shows'
  }
  else if (urlpath[2] === 'my-stuff') {
    presenceData.details = 'Browsing NOW TV'
    presenceData.state = 'Looking at watchlist'
  }
  else if (urlpath[2] === 'asset') {
    const assetTitle = document.querySelector<HTMLMetaElement>(
      'title',
    )
    presenceData.state = assetTitle?.textContent ? assetTitle.textContent.replace(' - NOW', '') : undefined
    presenceData.details = 'Browsing details'
  }

  if (presenceData.details)
    presence.setActivity(presenceData)
  else presence.clearActivity()
})
