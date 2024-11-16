(function(){
    var script = {
 "start": "this.init()",
 "overflow": "visible",
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "paddingLeft": 0,
 "mobileMipmappingEnabled": false,
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "width": "100%",
 "borderRadius": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "minHeight": 20,
 "propagateClick": false,
 "scripts": {
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "existsKey": function(key){  return key in window; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "unregisterKey": function(key){  delete window[key]; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "registerKey": function(key, value){  window[key] = value; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "defaultVRPointer": "laser",
 "vrPolyfillScale": 0.75,
 "verticalAlign": "top",
 "minWidth": 20,
 "definitions": [{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EA044F9_35A1_14AD_41A7_8AF634F7F944",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -162.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 170.45,
   "backwardYaw": 0.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5",
 "thumbnailUrl": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_t.jpg",
 "label": "2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_21D7499D_3561_1D65_41C9_BA314F20FEB8"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_25A61E98_3561_776C_418F_AA740741269E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E13C53A_35A1_15AC_41A2_211DA01E30DC",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 83.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -86.8,
   "backwardYaw": 101.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_27973278_3567_0FAB_41C5_2E878061B439",
   "distance": 1
  },
  {
   "yaw": 159.4,
   "backwardYaw": 67.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78",
   "distance": 1
  },
  {
   "yaw": -0.38,
   "backwardYaw": 159.9,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_25A61E98_3561_776C_418F_AA740741269E",
 "thumbnailUrl": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_t.jpg",
 "label": "2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_25F797FE_3561_F4A7_41B3_08E5B87E81F0",
  "this.overlay_277729CB_3561_7CED_4199_0D976CC0A457",
  "this.overlay_2786A2A4_356F_0F5B_41B5_91291E814731"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_27973278_3567_0FAB_41C5_2E878061B439_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E6AE564_35A1_15DB_4197_3AAC335A31B8",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -75.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "items": [
  {
   "media": "this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_25A61E98_3561_776C_418F_AA740741269E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_25A61E98_3561_776C_418F_AA740741269E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_24725613_3563_177D_4183_79CB1ED0277A",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_24725613_3563_177D_4183_79CB1ED0277A_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_27973278_3567_0FAB_41C5_2E878061B439",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_27973278_3567_0FAB_41C5_2E878061B439_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_204D9511_359F_157D_419B_57692D726818",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_204D9511_359F_157D_419B_57692D726818_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_23F1152A_359F_75AC_41C6_231566EA5684",
   "camera": "this.panorama_23F1152A_359F_75AC_41C6_231566EA5684_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_281FB404_35A1_0B64_41C0_DF46C7257433",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2924E5CE_35A1_14E7_41BE_32867C31274D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -83.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E718570_35A1_15BB_41B6_29F7CAEA2DCB",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 154.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E85E4E2_35A1_14DF_4187_919A11FBFCF2",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -146.49,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 8.04,
   "backwardYaw": -5.72,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24725613_3563_177D_4183_79CB1ED0277A",
   "distance": 1
  },
  {
   "yaw": -49.87,
   "backwardYaw": -14.32,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA",
 "thumbnailUrl": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_t.jpg",
 "label": "6",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_242F373A_3561_15AF_41C5_AA2B3C0EBEE0",
  "this.overlay_24B3AA66_3563_1FA7_41C8_B8C20C6561CC"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2F7404D1_35A1_14FD_41C0_91E081B0077D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -171.96,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EBBC4FF_35A1_14A5_41C1_7F77041D4891",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -92.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2ED2C517_35A1_1564_41C4_3BC5CD5082B3",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -68.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_284BB428_35A1_0BAB_4181_0E7373FCE532",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 174.28,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29E785B0_35A1_14BB_41C2_5D8010591A16",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 93.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2F71B4CA_35A1_14EF_41B5_E29CD59D3F28",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 165.68,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 0.63,
   "backwardYaw": 170.45,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5",
   "distance": 1
  },
  {
   "yaw": 23.96,
   "backwardYaw": 33.51,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021",
 "thumbnailUrl": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_215FB614_3567_F764_41C1_BF86556B83F7",
  "this.overlay_211F2171_3567_0DBC_41C0_43699BA09364"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E0F452E_35A1_15A4_41C3_CB2E9FCE2590",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -15.15,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E9E94EE_35A1_14A7_41B2_B7DA0E02FAB3",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -166.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E06F534_35A1_15A4_41C8_6329D0CFEB65",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -74.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E460558_35A1_15EB_41B8_C5000AE8448A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 179.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29D125A5_35A1_14A5_41B2_39F493758B96",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -112.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E88F4D7_35A1_14E5_41BC_369D792B99FC",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 152.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -179.75,
   "backwardYaw": 180,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_27973278_3567_0FAB_41C5_2E878061B439",
   "distance": 1
  },
  {
   "yaw": 0.38,
   "backwardYaw": 111.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_216EB15D_356F_0DE5_41C0_215D916C69DA",
 "thumbnailUrl": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_26533D5A_3560_F5EF_41BD_347F2960131F",
  "this.overlay_26F8DE9A_3563_176F_4199_37B87D5FBE1C"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021"
  },
  {
   "yaw": -167.94,
   "backwardYaw": 26.97,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
   "distance": 1
  },
  {
   "yaw": -17.96,
   "backwardYaw": 13.57,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "distance": 1
  },
  {
   "yaw": 0.63,
   "backwardYaw": -178.74,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99",
 "thumbnailUrl": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_t.jpg",
 "label": "4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_23EA66F1_359F_14BD_41C5_5C12CB253B27",
  "this.overlay_22897D46_35A0_F5E7_41C7_82376FFA2C96",
  "this.overlay_22381CC9_35A1_34ED_41A3_3BBBE43282BA",
  "this.overlay_2FE691F8_35A1_0CAB_41CA_21DD89AA2207"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_293525D3_35A1_14FD_419A_7D13E14AD55C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -2.89,
   "backwardYaw": 21.73,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_204D9511_359F_157D_419B_57692D726818",
   "distance": 1
  },
  {
   "yaw": -122.34,
   "backwardYaw": -17.71,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "distance": 1
  },
  {
   "yaw": -178.74,
   "backwardYaw": 0.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_20AC2D09_3561_156D_41C4_D81DF2E93901",
 "thumbnailUrl": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_t.jpg",
 "label": "6",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_2D42E2E9_35A1_0CAD_41A0_DCE864A8B575",
  "this.overlay_29DC932B_35A1_0DAC_41C7_B3A1359A2462",
  "this.overlay_2CE5A913_35A7_3D7C_41C6_F4633285BBBC"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29B1D593_35A1_157D_41C4_2DC52EB3F304",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 162.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29AB4587_35A1_1565_41B3_9ED65D693152",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 93.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_28222415_35A1_0B64_41C7_AD1D69051426",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 11.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -60.2,
   "backwardYaw": -164.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764",
   "distance": 1
  },
  {
   "yaw": 17.17,
   "backwardYaw": 164.85,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
   "distance": 1
  },
  {
   "yaw": -121.12,
   "backwardYaw": 105.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512",
 "thumbnailUrl": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_25146E60_3561_17DB_41BB_C889069E825B",
  "this.overlay_38F5DC12_3561_1B7F_41C3_6C5231FE4F71",
  "this.overlay_25238088_3563_0B6B_41C2_E3CCEB99E2F6"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EDBA511_35A1_157D_4185_020C2BDCC9C4",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2984A57B_35A1_15AD_41C0_1ED73B3AE123",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E2DA541_35A1_15DD_41A0_4D18B72C38A2",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 177.11,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 178.62,
   "backwardYaw": -25.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764",
   "distance": 1
  },
  {
   "yaw": -21.48,
   "backwardYaw": -78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E",
   "distance": 1
  },
  {
   "yaw": 104.48,
   "backwardYaw": 0.1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE",
 "thumbnailUrl": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_t.jpg",
 "label": "6",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_3B44F537_3563_15A5_41C9_7625866B2C61",
  "this.overlay_3B3176A5_3563_74A4_41B7_3883ABE9219E",
  "this.overlay_3BF2CBE5_356F_3CA5_41C5_A966CC7A1D78"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 67.7,
   "backwardYaw": 159.4,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25A61E98_3561_776C_418F_AA740741269E",
   "distance": 1
  },
  {
   "yaw": 105.55,
   "backwardYaw": -121.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512",
   "distance": 1
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78",
 "thumbnailUrl": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_255BE6DC_3563_74EB_41C5_79502B0EC639",
  "this.overlay_25FD032A_3561_0DAF_41AA_512D27BE54A7"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_280403FE_35A1_0CA4_41B5_A961B4EE5AFB",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 162.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 164.85,
   "backwardYaw": 17.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512",
   "distance": 1
  },
  {
   "yaw": -168.95,
   "backwardYaw": 87.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764",
   "distance": 1
  },
  {
   "yaw": 1.38,
   "backwardYaw": 175.1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E",
   "distance": 1
  },
  {
   "yaw": -15.48,
   "backwardYaw": 177.86,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
 "thumbnailUrl": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_t.jpg",
 "label": "2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_3882EA01_3560_FF5D_41B3_295F6F870EF8",
  "this.overlay_3B561817_3567_7B65_41CA_9120F426D5CA",
  "this.overlay_38996DFA_3561_14AF_41C6_043905AE2139",
  "this.overlay_250A4008_3567_0B6B_41A3_F5B42E835032"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_291A35C2_35A1_14DF_41C4_FA369ED51D97",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 54.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E4AC552_35A1_15FF_41C3_71D3A252383F",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -178.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 33.51,
   "backwardYaw": 23.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021",
   "distance": 1
  },
  {
   "yaw": -86.87,
   "backwardYaw": 96.34,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "distance": 1
  },
  {
   "yaw": 111.17,
   "backwardYaw": 0.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA",
   "distance": 1
  },
  {
   "yaw": 26.97,
   "backwardYaw": -167.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
 "thumbnailUrl": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_t.jpg",
 "label": "2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_26B34F0E_3560_F567_41B8_76FB4FA08FB6",
  "this.overlay_21EF70AB_3561_0CAD_4193_EF0386BE6C87",
  "this.overlay_2CC7CBB1_35A3_7CBD_41C5_A085114C5B07",
  "this.overlay_2D034694_35A3_377B_41C3_DBA3EBC71C5C"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29CBD599_35A1_156D_41C2_6E56E85273AE",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 57.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_204D9511_359F_157D_419B_57692D726818_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -78,
   "backwardYaw": -21.48,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE",
   "distance": 1
  },
  {
   "yaw": 175.1,
   "backwardYaw": 1.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E",
 "thumbnailUrl": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_t.jpg",
 "label": "3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_3B2913BE_3561_0CA7_4196_C507E06B0A31",
  "this.overlay_3B2086D9_3561_14ED_41C1_B65F0F66E8F0"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E9BC4E8_35A1_14AB_41C0_155419C0A7CC",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -153.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E33754C_35A1_15EB_41A0_81D89B07833A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 158.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2991A581_35A1_155D_41C3_F5B654C2EB0D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 174.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29ED25AA_35A1_14AF_41C6_42DB905F4C4A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -20.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29F395B6_35A1_14A7_41C9_D136BE390C59",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -36.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E97A4F4_35A1_14BB_41B5_91589F11271C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EF26528_35A1_15AC_41C9_037700E620C4",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 15.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_2338C925_3561_3DA5_41BA_351833FA5713_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EB4D505_35A1_1565_41B6_1E77E58C2D3C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -4.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_24725613_3563_177D_4183_79CB1ED0277A_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_280B43F3_35A1_0CBC_41C7_C34E5D701730",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -158.27,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_292875C8_35A1_14EB_41C0_B93BBB1858EC",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -156.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2941A5D9_35A1_14ED_41C8_7889B74A28C4",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 12.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E261547_35A1_15E5_41BC_37AD10A73094",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 101.37,
   "backwardYaw": -86.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25A61E98_3561_776C_418F_AA740741269E",
   "distance": 1
  },
  {
   "yaw": -27.13,
   "backwardYaw": 143.03,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24725613_3563_177D_4183_79CB1ED0277A",
   "distance": 1
  },
  {
   "yaw": 180,
   "backwardYaw": -179.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_27973278_3567_0FAB_41C5_2E878061B439",
 "thumbnailUrl": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_t.jpg",
 "label": "3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_260F2445_3561_0BE4_41CA_207ABD9862CA",
  "this.overlay_27AE71F9_3563_0CAD_41A5_2DFB09BF0432",
  "this.overlay_265BA2F9_356F_0CAD_41C5_780025C5F856"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_23F1152A_359F_75AC_41C6_231566EA5684"
  },
  {
   "yaw": 126.99,
   "backwardYaw": -96.47,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "distance": 1
  },
  {
   "yaw": 21.73,
   "backwardYaw": -2.89,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_204D9511_359F_157D_419B_57692D726818",
 "thumbnailUrl": "media/panorama_204D9511_359F_157D_419B_57692D726818_t.jpg",
 "label": "5",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_204D9511_359F_157D_419B_57692D726818_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_2CC3142D_35A7_0BA4_41B2_9A110592AC9B",
  "this.overlay_2FF82F70_35A7_15BC_4196_E1CB2B1B79C7",
  "this.overlay_2C6BD059_35A1_0BED_41BC_0F9C44169B61"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_23F1152A_359F_75AC_41C6_231566EA5684_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -125.23,
   "backwardYaw": -5.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_23F1152A_359F_75AC_41C6_231566EA5684",
   "distance": 1
  },
  {
   "yaw": 96.34,
   "backwardYaw": -86.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907",
   "distance": 1
  },
  {
   "yaw": -96.47,
   "backwardYaw": 126.99,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_204D9511_359F_157D_419B_57692D726818",
   "distance": 1
  },
  {
   "yaw": 13.57,
   "backwardYaw": -17.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99",
   "distance": 1
  },
  {
   "yaw": -17.71,
   "backwardYaw": -122.34,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2338C925_3561_3DA5_41BA_351833FA5713",
 "thumbnailUrl": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_t.jpg",
 "label": "3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_234BC6B4_3561_34A4_41C1_C204674FA85E",
  "this.overlay_204CA155_3563_0DE5_41B9_6C5BF98E0007",
  "this.overlay_2295CD5A_3563_35EF_4156_990BE0211915",
  "this.overlay_2353E470_3563_0BBB_41C5_ED5772B15661",
  "this.overlay_20986860_3561_1BDC_41B3_55A12CFA5EE4"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_298AE575_35A1_15A5_41A3_810954CD7A7E",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 102,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29A4B58D_35A1_1565_4172_161C98E35F51",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -53.01,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E64A56A_35A1_15AF_418E_08E2325E5C5C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 164.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -5.94,
   "backwardYaw": -125.23,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2338C925_3561_3DA5_41BA_351833FA5713",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_23F1152A_359F_75AC_41C6_231566EA5684",
 "thumbnailUrl": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_t.jpg",
 "label": "7",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_2C492090_35A1_0B7B_41C4_F57383924FD0"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E8124DC_35A1_14EB_419F_30F7C580EE2B",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -9.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EF8E522_35A1_155C_41BC_93C59B9E2710",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 58.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2E51E55E_35A1_15E7_41BC_6ECB0C11ECF0",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 130.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_283F3421_35A1_0B5D_41BC_72997F83AB03",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 119.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -5.72,
   "backwardYaw": 8.04,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA",
   "distance": 1
  },
  {
   "yaw": 143.03,
   "backwardYaw": -27.13,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_27973278_3567_0FAB_41C5_2E878061B439",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_24725613_3563_177D_4183_79CB1ED0277A",
 "thumbnailUrl": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_t.jpg",
 "label": "4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_27115145_3561_0DE4_41B0_EEFA2F899725",
  "this.overlay_227F23B1_3567_0CBC_41BF_4C4D57F8C0DC"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_290FF5BC_35A1_14AB_41C2_D576BB0706AA",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 0.1,
   "backwardYaw": 104.48,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE",
   "distance": 1
  },
  {
   "yaw": 177.86,
   "backwardYaw": -15.48,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446",
 "thumbnailUrl": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_t.jpg",
 "label": "5",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_3B390993_3561_1D7D_41A9_A34605323DA9",
  "this.overlay_3BA203FE_3561_0CA4_41AB_98EDCEE1FB44"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2828E40F_35A1_0B64_41C2_E81549D2A7A8",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -1.38,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2EEFE51D_35A1_1564_41C1_445F842DCF7A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -20.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 159.9,
   "backwardYaw": -0.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25A61E98_3561_776C_418F_AA740741269E",
   "distance": 1
  },
  {
   "yaw": -14.32,
   "backwardYaw": -49.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9",
 "thumbnailUrl": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_t.jpg",
 "label": "5",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_24C1DD55_357F_35E5_41B4_9DF05C630C4E",
  "this.overlay_264A1F36_3561_75A7_41C2_C1016C067722"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_2ECE750B_35A1_156D_41B8_F3AB9AE781FF",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -2.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_29C7059F_35A1_1565_41C4_37C82791F642",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -78.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -25.7,
   "backwardYaw": 178.62,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE",
   "distance": 1
  },
  {
   "yaw": 87.8,
   "backwardYaw": -168.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB",
   "distance": 1
  },
  {
   "yaw": -164.8,
   "backwardYaw": -60.2,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764",
 "thumbnailUrl": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_t.jpg",
 "label": "4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_3B99411F_3563_0D65_41B8_1C79618FEC8C",
  "this.overlay_3A327FDC_3563_14EB_41C6_7A8E9BB80692",
  "this.overlay_3A3523BC_3563_0CAB_41C2_C6C7175CEF46"
 ]
},
{
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "id": "MainViewer",
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "borderRadius": 0,
 "toolTipDisplayTime": 600,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "width": "100%",
 "progressBackgroundColorRatios": [
  0
 ],
 "minHeight": 50,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadHeight": 15,
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "minWidth": 100,
 "playbackBarHeadOpacity": 1,
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "class": "ViewerArea",
 "toolTipOpacity": 1,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontSize": "1.11vmin",
 "height": "100%",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "shadow": false,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "transitionMode": "blending",
 "toolTipShadowHorizontalLength": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "paddingTop": 0,
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "paddingBottom": 0,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "transitionDuration": 500,
 "progressBorderSize": 0,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021, this.camera_2E261547_35A1_15E5_41BC_37AD10A73094); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 18.86,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC53D3B_35A3_15AC_41C3_FE3E12997625",
   "pitch": -26.63,
   "yaw": 170.45,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_21D7499D_3561_1D65_41C9_BA314F20FEB8",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 18.86,
   "yaw": 170.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78, this.camera_29D125A5_35A1_14A5_41B2_39F493758B96); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 24.5,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABDDD39_35A3_15AC_41B5_A39979E09679",
   "pitch": -41.38,
   "yaw": 159.4,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_25F797FE_3561_F4A7_41B3_08E5B87E81F0",
 "data": {
  "label": "Arrow 06c Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 24.5,
   "yaw": 159.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -41.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9, this.camera_29ED25AA_35A1_14AF_41C6_42DB905F4C4A); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.24,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABA7D3A_35A3_15AC_41CA_B7A8C1A3EB30",
   "pitch": -27.7,
   "yaw": -0.38,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_277729CB_3561_7CED_4199_0D976CC0A457",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.24,
   "yaw": -0.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_27973278_3567_0FAB_41C5_2E878061B439, this.camera_29C7059F_35A1_1565_41C4_37C82791F642); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 15.44,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABABD3A_35A3_15AC_41B6_F5FCB98C62BF",
   "pitch": -25.31,
   "yaw": -86.8,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2786A2A4_356F_0F5B_41B5_91291E814731",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.44,
   "yaw": -86.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24725613_3563_177D_4183_79CB1ED0277A, this.camera_284BB428_35A1_0BAB_4181_0E7373FCE532); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 19.98,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABB8D3A_35A3_15AC_41C2_5CF94EB2D5A9",
   "pitch": -20.66,
   "yaw": 8.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_242F373A_3561_15AF_41C5_AA2B3C0EBEE0",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.98,
   "yaw": 8.04,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9, this.camera_2F71B4CA_35A1_14EF_41B5_E29CD59D3F28); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.53,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABBDD3A_35A3_15AC_41C1_56F7BA822240",
   "pitch": -26.57,
   "yaw": -49.87,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_24B3AA66_3563_1FA7_41C8_B8C20C6561CC",
 "data": {
  "label": "Arrow 06c Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.53,
   "yaw": -49.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_1_HS_1_0_0_map.gif",
      "width": 41,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907, this.camera_2E85E4E2_35A1_14DF_4187_919A11FBFCF2); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.97,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC46D3B_35A3_15AC_41C7_2B2BD23317D8",
   "pitch": -4.18,
   "yaw": 23.96,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_215FB614_3567_F764_41C1_BF86556B83F7",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.97,
   "yaw": 23.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5, this.camera_2E8124DC_35A1_14EB_419F_30F7C580EE2B); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.56,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC48D3B_35A3_15AC_41C0_8644E8323789",
   "pitch": -15.01,
   "yaw": 0.63,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_211F2171_3567_0DBC_41C0_43699BA09364",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.56,
   "yaw": 0.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_27973278_3567_0FAB_41C5_2E878061B439, this.camera_2EDBA511_35A1_157D_4185_020C2BDCC9C4); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.01,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC63D3A_35A3_15AC_417C_7C7378C049A0",
   "pitch": -45.16,
   "yaw": -179.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_26533D5A_3560_F5EF_41BD_347F2960131F",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.01,
   "yaw": -179.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -45.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907, this.camera_2ED2C517_35A1_1564_41C4_3BC5CD5082B3); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.82,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC67D3B_35A3_15AC_41C1_9AACCFC5AB8F",
   "pitch": -21.04,
   "yaw": 0.38,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_26F8DE9A_3563_176F_4199_37B87D5FBE1C",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.82,
   "yaw": 0.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.95,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC5CD3C_35A3_15A4_418D_F0A5B3780EE2",
   "pitch": -5.43,
   "yaw": -160.18,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_23EA66F1_359F_14BD_41C5_5C12CB253B27",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.95,
   "yaw": -160.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2338C925_3561_3DA5_41BA_351833FA5713, this.camera_2E9E94EE_35A1_14A7_41B2_B7DA0E02FAB3); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.87,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC21D3C_35A3_15A4_41BE_0A4006DBF5FD",
   "pitch": -18.53,
   "yaw": -17.96,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_22897D46_35A0_F5E7_41C7_82376FFA2C96",
 "data": {
  "label": "Arrow 06b Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.87,
   "yaw": -17.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901, this.camera_2E97A4F4_35A1_14BB_41B5_91589F11271C); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.59,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC28D3C_35A3_15A4_419B_059EA890639E",
   "pitch": -14.51,
   "yaw": 0.63,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_22381CC9_35A1_34ED_41A3_3BBBE43282BA",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.59,
   "yaw": 0.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907, this.camera_2E9BC4E8_35A1_14AB_41C0_155419C0A7CC); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 13.71,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC33D3C_35A3_15A4_41B6_3489CE161300",
   "pitch": -38.75,
   "yaw": -167.94,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2FE691F8_35A1_0CAB_41CA_21DD89AA2207",
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.71,
   "yaw": -167.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -38.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_3_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_204D9511_359F_157D_419B_57692D726818, this.camera_280B43F3_35A1_0CBC_41C7_C34E5D701730); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 19.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC34D3C_35A3_15A4_41CA_0CCF2077B9F0",
   "pitch": -31.84,
   "yaw": -2.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2D42E2E9_35A1_0CAD_41A0_DCE864A8B575",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.63,
   "yaw": -2.89,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2338C925_3561_3DA5_41BA_351833FA5713, this.camera_280403FE_35A1_0CA4_41B5_A961B4EE5AFB); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.7,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC3FD3C_35A3_15A4_41C9_50B345BF5964",
   "pitch": -25.81,
   "yaw": -122.34,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_29DC932B_35A1_0DAC_41C7_B3A1359A2462",
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.7,
   "yaw": -122.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_1_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99, this.camera_281FB404_35A1_0B64_41C0_DF46C7257433); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 18.94,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC00D3C_35A3_15A4_41B9_D029D0C8D8E7",
   "pitch": -26.19,
   "yaw": -178.74,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2CE5A913_35A7_3D7C_41C6_F4633285BBBC",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 18.94,
   "yaw": -178.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB, this.camera_2E0F452E_35A1_15A4_41C3_CB2E9FCE2590); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 10.58,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D20677_3561_17A5_41B7_F3A2A78A135A",
   "pitch": -28.07,
   "yaw": 17.17,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_25146E60_3561_17DB_41BB_C889069E825B",
 "data": {
  "label": "Arrow 06b Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.58,
   "yaw": 17.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764, this.camera_2EF26528_35A1_15AC_41C9_037700E620C4); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.9,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D1D678_3561_17AB_41C0_8ECED6898A76",
   "pitch": -22.8,
   "yaw": -60.2,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_38F5DC12_3561_1B7F_41C3_6C5231FE4F71",
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.9,
   "yaw": -60.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_1_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78, this.camera_2E06F534_35A1_15A4_41C8_6329D0CFEB65); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 19.79,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB1FD38_35A3_15AC_41C4_8641B8F025FA",
   "pitch": -0.54,
   "yaw": -121.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_25238088_3563_0B6B_41C2_E3CCEB99E2F6",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.79,
   "yaw": -121.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E, this.camera_298AE575_35A1_15A5_41A3_810954CD7A7E); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.31,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D64679_3561_17AD_41BD_474DDB86B65B",
   "pitch": -22.3,
   "yaw": -21.48,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B44F537_3563_15A5_41C9_7625866B2C61",
 "data": {
  "label": "Arrow 06a Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.31,
   "yaw": -21.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446, this.camera_2984A57B_35A1_15AD_41C0_1ED73B3AE123); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 25.48,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D61679_3561_17AD_41BC_8F449C865A46",
   "pitch": -9.2,
   "yaw": 104.48,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B3176A5_3563_74A4_41B7_3883ABE9219E",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 25.48,
   "yaw": 104.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764, this.camera_2E718570_35A1_15BB_41B6_29F7CAEA2DCB); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 15.46,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D6C679_3561_17AD_41BB_967F62241309",
   "pitch": -26.88,
   "yaw": 178.62,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3BF2CBE5_356F_3CA5_41C5_A966CC7A1D78",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.46,
   "yaw": 178.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512, this.camera_2EF8E522_35A1_155C_41BC_93C59B9E2710); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.44,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABD7D39_35A3_15AC_41A5_59D64ABD0492",
   "pitch": -0.35,
   "yaw": 105.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_255BE6DC_3563_74EB_41C5_79502B0EC639",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.44,
   "yaw": 105.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25A61E98_3561_776C_418F_AA740741269E, this.camera_2EEFE51D_35A1_1564_41C1_445F842DCF7A); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 21.74,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABD8D39_35A3_15AC_41C4_19A084B89304",
   "pitch": -31.97,
   "yaw": 67.7,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_25FD032A_3561_0DAF_41AA_512D27BE54A7",
 "data": {
  "label": "Arrow 06b Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 21.74,
   "yaw": 67.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E, this.camera_2EB4D505_35A1_1565_41B6_1E77E58C2D3C); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 21.08,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D19678_3561_17AB_41C0_B40F3BD4D3B2",
   "pitch": -29.08,
   "yaw": 1.38,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3882EA01_3560_FF5D_41B3_295F6F870EF8",
 "data": {
  "label": "Arrow 06c Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 21.08,
   "yaw": 1.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512, this.camera_2EA044F9_35A1_14AD_41A7_8AF634F7F944); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.18,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D07678_3561_17AC_41C2_7A02949CB969",
   "pitch": -30.08,
   "yaw": 164.85,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B561817_3567_7B65_41CA_9120F426D5CA",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.18,
   "yaw": 164.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446, this.camera_2ECE750B_35A1_156D_41B8_F3AB9AE781FF); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.89,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D03679_3561_17AD_418D_5B7A123C0B95",
   "pitch": -7.7,
   "yaw": -15.48,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_38996DFA_3561_14AF_41C6_043905AE2139",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.89,
   "yaw": -15.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764, this.camera_2EBBC4FF_35A1_14A5_41C1_7F77041D4891); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 20.71,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2703FF8E_3567_1567_41B9_ECB271573096",
   "pitch": -30.84,
   "yaw": -168.95,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_250A4008_3567_0B6B_41A3_F5B42E835032",
 "data": {
  "label": "Arrow 06a Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 20.71,
   "yaw": -168.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0_HS_3_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2338C925_3561_3DA5_41BA_351833FA5713, this.camera_2924E5CE_35A1_14E7_41BE_32867C31274D); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.53,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC6FD3B_35A3_15AC_41A0_CB90EF94018E",
   "pitch": -25.69,
   "yaw": -86.87,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_26B34F0E_3560_F567_41B8_76FB4FA08FB6",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.53,
   "yaw": -86.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA, this.camera_293525D3_35A1_14FD_419A_7D13E14AD55C); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.01,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC70D3B_35A3_15AC_41CA_87EE3D1BF987",
   "pitch": -45.16,
   "yaw": 111.17,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_21EF70AB_3561_0CAD_4193_EF0386BE6C87",
 "data": {
  "label": "Arrow 06b Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.01,
   "yaw": 111.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -45.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99, this.camera_2941A5D9_35A1_14ED_41C8_7889B74A28C4); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC7AD3B_35A3_15AC_41C8_0C7F2BC9EA27",
   "pitch": -25.56,
   "yaw": 26.97,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2CC7CBB1_35A3_7CBD_41C5_A085114C5B07",
 "data": {
  "label": "Arrow 06b Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.63,
   "yaw": 26.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021, this.camera_292875C8_35A1_14EB_41C0_B93BBB1858EC); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.98,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC7DD3B_35A3_15AC_41C9_57DF9E9D6699",
   "pitch": -3.68,
   "yaw": 33.51,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2D034694_35A3_377B_41C3_DBA3EBC71C5C",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.98,
   "yaw": 33.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB, this.camera_2E4AC552_35A1_15FF_41C3_71D3A252383F); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.46,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D08679_3561_17AD_41C2_5C44D40E5784",
   "pitch": -30.58,
   "yaw": 175.1,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B2913BE_3561_0CA7_4196_C507E06B0A31",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.46,
   "yaw": 175.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE, this.camera_2E33754C_35A1_15EB_41A0_81D89B07833A); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.76,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D75679_3561_17AD_41AD_013F9D0259D2",
   "pitch": -19.28,
   "yaw": -78,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B2086D9_3561_14ED_41C1_B65F0F66E8F0",
 "data": {
  "label": "Arrow 06c Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.76,
   "yaw": -78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24725613_3563_177D_4183_79CB1ED0277A, this.camera_29F395B6_35A1_14A7_41C9_D136BE390C59); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.38,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB92D3A_35A3_15AC_41BD_E33F13D43AC0",
   "pitch": -26.06,
   "yaw": -27.13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_260F2445_3561_0BE4_41CA_207ABD9862CA",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.38,
   "yaw": -27.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25A61E98_3561_776C_418F_AA740741269E, this.camera_29E785B0_35A1_14BB_41C2_5D8010591A16); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 13.3,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB94D3A_35A3_15AC_4191_6E9E2BFA6509",
   "pitch": -28.07,
   "yaw": 101.37,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_27AE71F9_3563_0CAD_41A5_2DFB09BF0432",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.3,
   "yaw": 101.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_216EB15D_356F_0DE5_41C0_215D916C69DA, this.camera_290FF5BC_35A1_14AB_41C2_D576BB0706AA); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 33.62,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB9ED3A_35A3_15AC_41B1_C65A2F5124AF",
   "pitch": -3.06,
   "yaw": 180,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_265BA2F9_356F_0CAD_41C5_780025C5F856",
 "data": {
  "label": "Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 33.62,
   "yaw": 180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_2_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901, this.camera_2E2DA541_35A1_15DD_41A0_4D18B72C38A2); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.66,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC0BD3D_35A3_15A4_41BC_6C2DBD689310",
   "pitch": -20.03,
   "yaw": 21.73,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2CC3142D_35A7_0BA4_41B2_9A110592AC9B",
 "data": {
  "label": "Arrow 06b Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.66,
   "yaw": 21.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 20.04,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC0DD3D_35A3_15A4_41C5_9E789C247FD0",
   "pitch": -43.52,
   "yaw": 162.92,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2FF82F70_35A7_15BC_4196_E1CB2B1B79C7",
 "data": {
  "label": "Arrow 06b Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 20.04,
   "yaw": 162.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -43.52,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2338C925_3561_3DA5_41BA_351833FA5713, this.camera_2E13C53A_35A1_15AC_41A2_211DA01E30DC); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 13.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC14D3D_35A3_15A4_41B8_34D03028568D",
   "pitch": -25.31,
   "yaw": 126.99,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2C6BD059_35A1_0BED_41BC_0F9C44169B61",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.63,
   "yaw": 126.99,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20AC2D09_3561_156D_41C4_D81DF2E93901, this.camera_29CBD599_35A1_156D_41C2_6E56E85273AE); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.66,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC55D3B_35A3_15AC_41B7_A4413CB63D85",
   "pitch": -20.03,
   "yaw": -17.71,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_234BC6B4_3561_34A4_41C1_C204674FA85E",
 "data": {
  "label": "Arrow 06b Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.66,
   "yaw": -17.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99, this.camera_29B1D593_35A1_157D_41C4_2DC52EB3F304); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.64,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC47D3B_35A3_15AC_41C6_BC9D774F7B0A",
   "pitch": -20.54,
   "yaw": 13.57,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_204CA155_3563_0DE5_41B9_6C5BF98E0007",
 "data": {
  "label": "Arrow 06a Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.64,
   "yaw": 13.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_204D9511_359F_157D_419B_57692D726818, this.camera_29A4B58D_35A1_1565_4172_161C98E35F51); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.82,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC49D3C_35A3_15A4_41A0_F14361E439A9",
   "pitch": -24.81,
   "yaw": -96.47,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2295CD5A_3563_35EF_4156_990BE0211915",
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.82,
   "yaw": -96.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_2_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_23F1152A_359F_75AC_41C6_231566EA5684, this.camera_2991A581_35A1_155D_41C3_F5B654C2EB0D); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 21.28,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC51D3C_35A3_15A4_41B4_820B5B3D0D36",
   "pitch": -28.07,
   "yaw": -125.23,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2353E470_3563_0BBB_41C5_ED5772B15661",
 "data": {
  "label": "Arrow 06c Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 21.28,
   "yaw": -125.23,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_3_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907, this.camera_29AB4587_35A1_1565_41B3_9ED65D693152); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 13.54,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC5AD3C_35A3_15A4_41B6_A137B46B6B94",
   "pitch": -26.06,
   "yaw": 96.34,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_20986860_3561_1BDC_41B3_55A12CFA5EE4",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.54,
   "yaw": 96.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_4_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2338C925_3561_3DA5_41BA_351833FA5713, this.camera_291A35C2_35A1_14DF_41C4_FA369ED51D97); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.56,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AC1FD3D_35A3_15A4_41BD_2DBF234D716B",
   "pitch": -25.94,
   "yaw": -5.94,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_2C492090_35A1_0B7B_41C4_F57383924FD0",
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.56,
   "yaw": -5.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA, this.camera_2F7404D1_35A1_14FD_41C0_91E081B0077D); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB87D3A_35A3_15AC_41C7_22376975C2A9",
   "pitch": -25.81,
   "yaw": -5.72,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_27115145_3561_0DE4_41B0_EEFA2F899725",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.63,
   "yaw": -5.72,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_27973278_3567_0FAB_41C5_2E878061B439, this.camera_2E88F4D7_35A1_14E5_41BC_369D792B99FC); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.38,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2AB88D3A_35A3_15AC_41C8_D23A18DF21EA",
   "pitch": -27.82,
   "yaw": 143.03,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_227F23B1_3567_0CBC_41BF_4C4D57F8C0DC",
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.38,
   "yaw": 143.03,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_1_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB, this.camera_2E64A56A_35A1_15AF_418E_08E2325E5C5C); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.93,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D73679_3561_17AD_41C8_023FFD5C3999",
   "pitch": -13.75,
   "yaw": 177.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B390993_3561_1D7D_41A9_A34605323DA9",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.93,
   "yaw": 177.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE, this.camera_2E6AE564_35A1_15DB_4197_3AAC335A31B8); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.81,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D7E679_3561_17AD_41C6_B8A34FEA4C07",
   "pitch": -10.21,
   "yaw": 0.1,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3BA203FE_3561_0CA4_41AB_98EDCEE1FB44",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.81,
   "yaw": 0.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25A61E98_3561_776C_418F_AA740741269E, this.camera_2E460558_35A1_15EB_41B8_C5000AE8448A); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.39,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABB3D3A_35A3_15AC_419F_DC2FDB0DD82F",
   "pitch": -29.08,
   "yaw": 159.9,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_24C1DD55_357F_35E5_41B4_9DF05C630C4E",
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.39,
   "yaw": 159.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_1_HS_0_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA, this.camera_2E51E55E_35A1_15E7_41BC_6ECB0C11ECF0); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.36,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_2ABB6D3A_35A3_15AC_41B0_992F17DD99E9",
   "pitch": -28.2,
   "yaw": -14.32,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_264A1F36_3561_75A7_41C2_C1016C067722",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.36,
   "yaw": -14.32,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB, this.camera_28222415_35A1_0B64_41C7_AD1D69051426); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 13.27,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D6A679_3561_17AD_41B7_294AD17E2E0B",
   "pitch": -28.33,
   "yaw": 87.8,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3B99411F_3563_0D65_41B8_1C79618FEC8C",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.27,
   "yaw": 87.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE, this.camera_2828E40F_35A1_0B64_41C2_E81549D2A7A8); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.71,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D57679_3561_17AD_41B6_AD75F9531EB7",
   "pitch": -40.38,
   "yaw": -25.7,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3A327FDC_3563_14EB_41C6_7A8E9BB80692",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.71,
   "yaw": -25.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -40.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512, this.camera_283F3421_35A1_0B5D_41BC_72997F83AB03); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 15.58,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_26D5D679_3561_17AD_41C1_F02B0A170F85",
   "pitch": -48.17,
   "yaw": -164.8,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_3A3523BC_3563_0CAB_41C2_C6C7175CEF46",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.58,
   "yaw": -164.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -48.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC53D3B_35A3_15AC_41C3_FE3E12997625",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2187FBE6_3567_1CA7_41C1_5478AB9DF5C5_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABDDD39_35A3_15AC_41B5_A39979E09679",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABA7D3A_35A3_15AC_41CA_B7A8C1A3EB30",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABABD3A_35A3_15AC_41B6_F5FCB98C62BF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25A61E98_3561_776C_418F_AA740741269E_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABB8D3A_35A3_15AC_41C2_5CF94EB2D5A9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABBDD3A_35A3_15AC_41C1_56F7BA822240",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24BBBB07_3561_3D64_41C1_B81B3A2A23EA_1_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC46D3B_35A3_15AC_41C7_2B2BD23317D8",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC48D3B_35A3_15AC_41C0_8644E8323789",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2017CFA9_3560_F4AD_41A2_1EBB3AA2A021_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC63D3A_35A3_15AC_417C_7C7378C049A0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC67D3B_35A3_15AC_41C1_9AACCFC5AB8F",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_216EB15D_356F_0DE5_41C0_215D916C69DA_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC5CD3C_35A3_15A4_418D_F0A5B3780EE2",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC21D3C_35A3_15A4_41BE_0A4006DBF5FD",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC28D3C_35A3_15A4_419B_059EA890639E",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC33D3C_35A3_15A4_41B6_3489CE161300",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20C5C46A_3561_0BAC_41C6_5141DFAE6D99_1_HS_3_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC34D3C_35A3_15A4_41CA_0CCF2077B9F0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC3FD3C_35A3_15A4_41C9_50B345BF5964",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC00D3C_35A3_15A4_41B9_D029D0C8D8E7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20AC2D09_3561_156D_41C4_D81DF2E93901_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D20677_3561_17A5_41B7_F3A2A78A135A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_1_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D1D678_3561_17AB_41C0_8ECED6898A76",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_1_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB1FD38_35A3_15AC_41C4_8641B8F025FA",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3E3A4DE7_3561_F4A4_41BD_6797F6F28512_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D64679_3561_17AD_41BD_474DDB86B65B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D61679_3561_17AD_41BC_8F449C865A46",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D6C679_3561_17AD_41BB_967F62241309",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3B24A975_3563_1DA5_41C0_F493B30A66EE_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABD7D39_35A3_15AC_41A5_59D64ABD0492",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABD8D39_35A3_15AC_41C4_19A084B89304",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25ACCB5A_3563_1DEF_41C5_F32DF500CB78_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D19678_3561_17AB_41C0_B40F3BD4D3B2",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D07678_3561_17AC_41C2_7A02949CB969",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D03679_3561_17AD_418D_5B7A123C0B95",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_1_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2703FF8E_3567_1567_41B9_ECB271573096",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3A66BF94_3561_157B_41BA_F2D8B64F1EEB_0_HS_3_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC6FD3B_35A3_15AC_41A0_CB90EF94018E",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC70D3B_35A3_15AC_41CA_87EE3D1BF987",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC7AD3B_35A3_15AC_41C8_0C7F2BC9EA27",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_2_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC7DD3B_35A3_15AC_41C9_57DF9E9D6699",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_263D1FF6_3563_34A7_41C5_042CD8DDA907_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D08679_3561_17AD_41C2_5C44D40E5784",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D75679_3561_17AD_41AD_013F9D0259D2",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_38BD4F84_3567_F55B_41C7_5EE3DA17D72E_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB92D3A_35A3_15AC_41BD_E33F13D43AC0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB94D3A_35A3_15AC_4191_6E9E2BFA6509",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB9ED3A_35A3_15AC_41B1_C65A2F5124AF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_27973278_3567_0FAB_41C5_2E878061B439_1_HS_2_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC0BD3D_35A3_15A4_41BC_6C2DBD689310",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC0DD3D_35A3_15A4_41C5_9E789C247FD0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC14D3D_35A3_15A4_41B8_34D03028568D",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_204D9511_359F_157D_419B_57692D726818_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC55D3B_35A3_15AC_41B7_A4413CB63D85",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC47D3B_35A3_15AC_41C6_BC9D774F7B0A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC49D3C_35A3_15A4_41A0_F14361E439A9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_2_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC51D3C_35A3_15A4_41B4_820B5B3D0D36",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_3_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC5AD3C_35A3_15A4_41B6_A137B46B6B94",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2338C925_3561_3DA5_41BA_351833FA5713_1_HS_4_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AC1FD3D_35A3_15A4_41BD_2DBF234D716B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_23F1152A_359F_75AC_41C6_231566EA5684_1_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB87D3A_35A3_15AC_41C7_22376975C2A9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2AB88D3A_35A3_15AC_41C8_D23A18DF21EA",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24725613_3563_177D_4183_79CB1ED0277A_1_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D73679_3561_17AD_41C8_023FFD5C3999",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D7E679_3561_17AD_41C6_B8A34FEA4C07",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3BFC5E84_3561_775B_41C7_32FCEEFA3446_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABB3D3A_35A3_15AC_419F_DC2FDB0DD82F",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_1_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_2ABB6D3A_35A3_15AC_41B0_992F17DD99E9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2501FC97_357F_3B65_41BD_E45D2C6CE8E9_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D6A679_3561_17AD_41B7_294AD17E2E0B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D57679_3561_17AD_41B6_AD75F9531EB7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_26D5D679_3561_17AD_41C1_F02B0A170F85",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3AEE62C0_3563_0CDB_41C1_AA53ABDCF764_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
}],
 "scrollBarMargin": 2,
 "class": "Player",
 "downloadEnabled": false,
 "paddingTop": 0,
 "layout": "absolute",
 "gap": 10,
 "shadow": false,
 "paddingBottom": 0,
 "mouseWheelEnabled": true,
 "data": {
  "name": "Player455"
 },
 "horizontalAlign": "left",
 "contentOpaque": false,
 "desktopMipmappingEnabled": false,
 "backgroundPreloadEnabled": true,
 "height": "100%"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
