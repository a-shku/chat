var socket;
cancel.addEventListener('click', function(e){
	e.preventDefault();
	photoUploadWrapper.classList.add('none');
	photoInput.value = '';
	dndText.classList.remove('none');
	dnd.removeAttribute("style")
});

 function clearFileInputField(Id){
	 document.getElementById(Id).innerHTML = document.getElementById(Id).innerHTML;
    }

new Promise(function(res, rej){registrBtn.addEventListener('click', function(e){
	e.preventDefault();
	socket = new WebSocket('ws://localhost:5000');
	
	socket.onopen = function(){
		//соединение установлено
		console.log('соединение установлено');
		
		//отправить запрос о регистрации
		/*registration request*/
		(socket.send(JSON.stringify({
			op: 'reg',
			data: {
				name: userName.value,
				login: login.value
			}
		})));
	/*/registration request*/
		res();
	};/*перенести then сюда*/
	
	socket.onerror = function(e) {
		//ошибка соединения
		console.log(e);
	};
	
	socket.onerror = function(e) {
		 //соединение было закрыто
		console.log(e);
	};
	
	socket.onclose = function() {
	console.log('Connection closed');
}
	
});
}).then(function(){
	
	/*переношу*/
	var good = {};
	var userArr = [];
	
	var factoryUserList = function(users){
		var userCount = document.createElement('div');
		usersCount.innerHTML = '<p>'+users.length+' участников в чате</p>';
		var userUl = document.createElement('ul');
		
		for(var i = 0; i<users.length; i++){
			var userLi = document.createElement('li');
			userLi.innerHTML = users[i].name;
			userUl.appendChild(userLi);
		}
		 divUserUl.innerHTML = userUl.innerHTML;
		//usersCount.appendChild(userCount);
	};	
	
	socket.onmessage = function(e) {
   //пришло сообщение от сервера, надо его обработать
    console.log('onmessage', e.data);
	var response = JSON.parse(e.data);
	
		//get a token after registration
		if(response.op === 'token'){
			document.cookie = "tre=qwe";
			var token = JSON.parse(e.data).token;
			document.cookie = "token="+token;
			regWrapper.classList.add('none');
			good.to = token;
			
		/*display old messages*/
			/*list of old messages*/
			
			var token = JSON.parse(e.data).token,
				regData = JSON.parse(e.data),
				arrOldMess = regData.messages;
				
			for(var i = 0; i<arrOldMess.length; i++){
				var oldMessBody = arrOldMess[i].body,
					oldMessUser = arrOldMess[i].user,
					oldMessTime = new Date(arrOldMess[i].time),
					hours = oldMessTime.getHours(),
					minutes = oldMessTime.getMinutes(),
					seconds = oldMessTime.getSeconds();
					if(hours < 10){
						hours = '0'+hours;
					}
					if(minutes < 10){
						minutes = '0'+minutes;
					}
					if(seconds < 10){
						seconds = '0'+seconds;
					}
				/*console.log(oldMessTime);*/
				
				/*create a template for message*/
				var oldMessLi = document.createElement('li');
			oldMessLi.innerHTML = '<img src="http://localhost:5000/photos/'+oldMessUser.login+'?123" class="photo" data-user="'+oldMessUser.login+'">'+'<p class="timeNname"><span class="messUserName"> '+oldMessUser.name+'</span><span class="time">'+hours+':'+minutes+':'+seconds+'</span></p>'+'<p class="message">'+oldMessBody+'</p>';
			/*add a message to list*/
			chat.appendChild(oldMessLi);
			/*add a message to list*/
				/*/create a template for message*/
	
			}
			/*/list of old messages*/
		/*/display old messages*/
		/*create an image for sidebar*/
		var userli = document.createElement('div');
			userli.innerHTML = '<img src="http://localhost:5000/photos/'+login.value+'?123" class="sidePhoto" id="sidePhoto" data-user="'+login.value+'">'+'<span  class="sideUserName">'+userName.value+'</span>'
			
				/*var sideImg = document.createElement('img');
				sideImg.setAttribute('src', 'http://localhost:5000/photos/'+oldMessUser.login+'?123');
				sideImg.setAttribute('class', 'sidePhoto');*/
				you.innerHTML = userli.innerHTML;
		//*create an image for sidebar*/
			//userL(regData.users); было
			
			var userL = function(users) {
				userArr = users;
				console.log(userArr.length);
				factoryUserList(userArr);	
			}
			userL(regData.users);
			chat.scrollTop = chat.scrollHeight;
		}//if
		
		else if(response.op === 'user-enter'){
			userArr.push(response.user);
			console.log(userArr.length);
			factoryUserList(userArr);	
		}
		
		else if(response.op === 'user-out'){
			//userArr.splice(0, 1);
			
			console.log(userArr.length);
			for(var i = 0; i < userArr.length; i++){
				if(userArr[i].login == response.user.login){
					//console.log(userArr[i].login);
					userArr.splice(userArr[i], 1);
					}
				
			}
			factoryUserList(userArr);
		}
		
		//get a sent message
		else if(response.op === 'message'){
			messText.value = '';
			var Smess = response.body,
				Suser = response.user;//obj Suser.name +  Suser.login

			var Stime = new Date(response.time);
			
				var hours = Stime.getHours(),
					minutes = Stime.getMinutes(),
					seconds = Stime.getSeconds();
					if(hours < 10){
						hours = '0'+hours;
					}
					if(minutes < 10){
						minutes = '0'+minutes;
					}
					if(seconds < 10){
						seconds = '0'+seconds;
					}
					
			var messLi = document.createElement('li');
			messLi.innerHTML = '<img src="http://localhost:5000/photos/'+Suser.login+'?123" class="photo" data-user="'+Suser.login+'">'+'<p class="timeNname"><span class="messUserName">'+Suser.name+'</span><span class="time">'+hours+':'+minutes+':'+seconds+'</span></p>'+'<p class="message">'+Smess+'</p>';
			/*add a message to list*/
			chat.appendChild(messLi);
			/*add a message to list*/
			chat.scrollTop = chat.scrollHeight;			
		}
		
		//change a photo
		else if(response.op === 'user-change-photo'){
			var Suser = response.user;
				var userChangePhotoLogin = response.user.login;
				
			Array.from(arrImgForChange = document.querySelectorAll('[data-user ="'+ Suser.login+'"]')).forEach(function(elem){
				elem.src = 'http://localhost:5000/photos/'+Suser.login+'?123';
			});

			/*for(var i = 0; i< arrImgForChange.length; i++)	{
				arrImgForChange[i].setAttribute('src', 'http://localhost:5000/photos/'+Suser.login+'?123')
			}*/
			
		}
		
		else if(response.op === 'error'){
			
			if(response.sourceOp === 'reg'){
				//alert('reg');
				var errorMess = response.error.message;
				var errorStr = document.createElement('div');
				errorStr.classList.add('error');
				errorStr.innerHTML = errorMess+'ed'+'!';
				registration.appendChild(errorStr);
				console.log('no');
				socket.close();
				return;
			}
		}
		
		
		/*загрузка фото*/
		
		sidePhoto.onclick = function(){
			photoUploadWrapper.classList.remove('none');
		};
		dnd.addEventListener('click', function(){
			photoInput.click();
		});
		dnd.addEventListener('dragover', function(e){
			e.preventDefault();
		});

		/*filereader*/
			var fileReader = new FileReader();

				fileReader.addEventListener('load', function() {
					//var dndImg = document.createElement('img');
					//dndImg.setAttribute('src', this.result);
					//dndImg.src = this.result;
					dnd.style.backgroundImage = 'url('+this.result+')';
					//dnd.appendChild = dndImg;
					
				});
				
				photoInput.addEventListener('change', function(e) {
					console.log('change');
					var file = e.target.files[0];

					fileReader.readAsDataURL(file);
					
					//dnd.innerText = '';
					dndText.classList.add('none');
				});
			//*filereader*/

		dnd.addEventListener('drop', function(e){
			e.preventDefault();
			e.stopPropagation();
			console.log('drop');
			var file = e.dataTransfer.files[0];
			//photoInput.files[0] = e.dataTransfer.files[0];
			
			//clearFileInputField('photoForm');
			photoForm.reset();
			
			dndText.classList.add('none');
			fileReader.readAsDataURL(file);
			
			var token = good.to,
						
			data = new FormData();
			data.append('photo', file);
			data.append('token', token);
			good.data = data;		
			
		});
		/*загрузка фото*/
	};
	/*/переношу*/
	
	/*Listening messsages sending*/
	sendMess.addEventListener('click', function(event){
		event.preventDefault();
		var token = good.to,
			message = messText.value;
	
		socket.send(JSON.stringify({
			op: 'message',
			token: token, //уникальный идентификатор, полученный при регистрации
			data: {
				body: message //тело сообщения
			}
		}));
		
		/*send a message to server*/
	});	
	
	/*/Listening messsages sending*/
	
	/*sending a photo*/
	sendPhoto.addEventListener('click', function(e){
		e.preventDefault();

		var token = good.to,
			photoFile = photoInput.files[0],
			data = new FormData();
		data.append('photo', photoFile);
		data.append('token', token);
		
		if(photoFile){
			data = data
		} else {data = good.data}
			
		xhrFunc(data);
		/*var xhr = new XMLHttpRequest();
		xhr.open('post', 'http://localhost:5000/upload', true);
		xhr.send(data);
		
		xhr.onload = function(){
						console.log(xhr.response);
						//clear the input!
					};
		 xhr.onreadystatechange = function(){
			console.log(xhr.status);
		 };		
		cancel.click();*/
	});
	/*/sending a photo*/
	/*вынести xhr в отдельную функцию и вызывать отдельно в инпуте и в драгндроп*/
	/*xhr*/
	function xhrFunc(data){
		var xhr = new XMLHttpRequest();
		xhr.open('post', 'http://localhost:5000/upload', true);
		xhr.send(data);
		
		xhr.onload = function(){
						console.log(xhr.response);
						//clear the input!
					};
		 xhr.onreadystatechange = function(){
			console.log(xhr.status);
		 };		
		cancel.click();
	};
	/*xhr*/
});

























