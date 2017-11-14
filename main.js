var posts = [];
var usersID = [];
var idUser = '';
var accessToken = '';

function getTopPostsList(idPage, count) {
	var url = 'https://graph.facebook.com/v2.9/' 
		+ idPage
		+ '?fields=name,posts.limit(' 
		+ count 
		+ ')' 
		+ '&access_token='
		+ accessToken;

	$.ajax({
		url: url,
		type: 'GET',
        dataType: 'JSON',
		data: {},
		success: function (response) {
            posts = response.posts.data;
            $('.body').append('Fetching data from ' + response.name);
        },
        error: function() {
            console.log('error call_api: ' + url);
        },
        async: false
	});
}

function getUsersList(idPost, count, idPage) {
	var url = 'https://www.facebook.com/ufi/reaction/profile/browser/fetch/?limit=' 
		+ count
		+ '&shown_ids=null' 
		+ '&total_count=0' 
		+ '&ft_ent_identifier=' 
		+ idPost
		+ '&dpr=1' 
		+ '&__user=' 
		+ idUser
		+ '&__a=1&__dyn=5V4cjEzUGByC5A9VoWWOGi9Fxrz9EZz8-iWF3ozyO9LFGA4XG7VKEWEdQq5-ahUKFGV8kx2mqqUnCG22aUKFUKipi28gyEnGieKmjBXDm4WgWbBypV8iGtxO6oHDh8LBxDVFebAZ4pVoW5-czUO49epz8x5G22ElByECQiAiaxGbBzEKqi2m5KbyFLJogJbgqz8y9xCRjggUWl2eVfxqlG4olDh4dy8gWCyUgCyFKiq4m8yrK4rGVax7AyrBFvyaFrAuGQqmQh78WDzo8k9BGq9ggBKbLAAzUxQaBrCyF8C9G&__af=iw&__req=u&__be=-1&__pc=PHASED%3ADEFAULT&__rev=3098087&__spin_r=3098087&__spin_b=trunk&__spin_t=1497719889';
	$.ajax({
		url: url,
		type: 'GET',
        dataType: 'JSON',
		data: {},
		success: function (response) {
        },
        error: function(err) {
            console.log('error');
            var tmp = JSON.parse(err.responseText.replace('for (;;);', '')).domops[0][3].__html;
            getUsersInfo(tmp, idPost, idPage);
        },
	});

}

function getUsersInfo(html, idPost, idPage) {
	$('.body').append('<br/>Post: ' + idPage);

	while(true) {

		if(html.indexOf('data-hovercard=') !== -1 && html.indexOf(' data-hovercard-prefer-more-content-show=') !== -1 ) {
			var index = html.indexOf('data-hovercard=');
			var index2 = html.indexOf(' data-hovercard-prefer-more-content-show=');
			let hoverCard = html.substring(index + 16, index2 - 1);
			let id = hoverCard.substring(28, hoverCard.indexOf('&amp;extragetparams'));
			html = html.replace('data-hovercard=', '');
			html = html.replace(' data-hovercard-prefer-more-content-show=', '');
			
			let hoverCardUrl = 'https://www.facebook.com/ajax/hovercard/user.php?id=' 
				+ id
				+ '&dpr=1&endpoint=%2Fajax%2Fhovercard%2Fuser.php%3Fid%3D' 
				+ id
				+ '&__user=' 
				+ idUser
				+ '&__a=1&__dyn=5V4cjEzUGByC5A9UoHaEWC5ER6yUmyVbGAEG8UNFLFCxG7UDAyoS2N6xCaxubwTCxKqEaUZ7yUJi28rxuF8WVpKmVRxeUW6VV8iGt0TyKum4UpKqqbAWCDxh1rz8-cx2jxm1iyECQum2m4oWbyU9omUmC-Rx2iJ1G7WxGAi4ebHxerxqawzKt4gmx2i2eq4V8ooy9KUhKHxx6zrUC8Gm8yqG9J4yCGwHxqm9Kl12mUK9gkybgGnyEGiqEC&__af=iw&__req=21&__be=-1&__pc=PHASED%3ADEFAULT&__rev=3096512&__spin_r=3096512&__spin_b=trunk&__spin_t=1497660018';
			$.ajax({
				url: hoverCardUrl,
				type: 'GET',
		        dataType: 'JSON',
				data: {},
				success: function (response) {
					console.log(response);
		        },
		        error: function(err) {
		            console.log('error');
		            let tmp = JSON.parse(err.responseText.replace('for (;;);', ''));
		            let el = document.createElement( 'html' );
					el.innerHTML = tmp.jsmods.markup[0][1].__html;
					if (el.getElementsByClassName('_h5y')[0] != undefined) {
						el.getElementsByClassName('_h5y')[0].innerHTML = '';
					}
					if (el.getElementsByClassName('_7lv')[0] != undefined) {
						el.getElementsByClassName('_7lv')[0].innerHTML = '';
					}
					if (el.getElementsByClassName('uiList pageByline')[0] != undefined) {
						el.getElementsByClassName('uiList pageByline')[0].innerHTML = '';
					}
					if (el.getElementsByClassName('accessible_elem')[0] != undefined) {
						el.getElementsByClassName('accessible_elem')[0].innerHTML = '';
					}
					if (el.getElementsByClassName('_7lo _572u clearfix uiBoxGray topborder')[0] != undefined) {
						el.getElementsByClassName('_7lo _572u clearfix uiBoxGray topborder')[0].innerHTML = '';
					}

					let data = {
						facebook_id: id,
						page_id: idPage,
						html: el.innerHTML,
					};
					$.ajax({
						url: 'http://localhost:3000/api/nha_test/',
						type: 'PUT',
						data: data,
						success: function (response) {
				        },
				        error: function(err) {
				            console.log('error');
				        }
				    });
		        },
			});

		} else {
			break;
		}

	}

}

function getAccessToken() {
	console.log('Get accessToken...');
    FB.init({ 
        appId: '1382641861749486', 
        cookie: true, 
        xfbml: true, 
        status: true });
    FB.getLoginStatus(function (response) {
        if (response.authResponse) {
            console.log(response);
        } else {
            console.log('err');
        }
    });
}

$(document).ready(function($) {
	idUser = '100009468131010';
	accessToken = "EAACEdEose0cBAHePjfMAzJANNeiUSmom3mOIcZBwGMIBX7p4PPP336AJrzssapOcFm1aVczl0dCVUvPdU6mHjjWsQyC8tOVEMZBB846EDebUv15oAbDo8YPQ8UVlkesHlbnfS8wANVnMm561QJTR8gZBZC0id4kTxZC9DZCltYZB2P2vHYXffhIFydrqh73szQZD";
	$('.page-id-input').keyup(function(event) {
		if(event.which == 13) {
			var val = $(this).val();
            $('.body').html('');
            if(val == undefined || val == '') {
				alert('WRONG PAGE ID');
				return;
			}
			getTopPostsList(val, 10);
			for (var i = posts.length - 1; i >= 0; i--) {
				var tmpIdPost = posts[i].id.split('_')[1];
				console.log(tmpIdPost);
				getUsersList(tmpIdPost, 500, val);
			}
		}
	});
	
});


function viewClick() {
    $('.body').html('');
    var val = $('.page-id-input').val();
	if(val == undefined || val == '') {
		alert('WRONG PAGE ID');
		return;
	}
	$.ajax({
		url: 'http://localhost:3000/api/nha_test/all/' + val,
		type: 'GET',
		data: {},
		success: function (response) {
			console.log(response);
			for (var i = response.length - 1; i >= 0; i--) {
				$('.body').append(response[i].html);
			}
        },
        error: function(err) {
            console.log('error');
            console.log(err);
        }
    });
}

function cloneClick() {
    $('.body').html('');
	var val = $('.page-id-input').val();
	console.log(val);
	if(val == undefined || val == '') {
		alert('WRONG PAGE ID');
		return;
	}
	getTopPostsList(val, 20);
	for (let i = posts.length - 1; i >= 0; i--) {
		let tmpIdPost = posts[i].id.split('_')[1];
		getUsersList(tmpIdPost, 200, val);
	}
}