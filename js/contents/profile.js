"use strict";

////////////////////////////////////////////////////////////////////////////////
// ユーザ情報表示
////////////////////////////////////////////////////////////////////////////////
Contents.profile = function( cp )
{
	var p = $( '#' + cp.id );
	var cont = p.find( 'div.contents' );
	var profile = null;

	cp.SetIcon( 'icon-user' );

	////////////////////////////////////////////////////////////
	// タイトル設定
	////////////////////////////////////////////////////////////
	var SetTitle = function() {
		var open_acc = ConvertDisplayName( g_cmn.account[cp.param['account_id']].display_name, g_cmn.account[cp.param['account_id']].username );

		if ( profile != null )
		{
			var display_name = ConvertDisplayName( profile.display_name, profile.username );

			cp.SetTitle( display_name + ' ' + i18nGetMessage( 'i18n_0107' ) + 
				'(' + open_acc + '@' + g_cmn.account[cp.param['account_id']].instance + ')', false );
		}
		else
		{
			cp.SetTitle( i18nGetMessage( 'i18n_0107' ) + 
				'(' + open_acc + '@' + g_cmn.account[cp.param['account_id']].instance + ')', false );
		}
	};

	////////////////////////////////////////////////////////////
	// ユーザ情報作成
	////////////////////////////////////////////////////////////
	var ProfileMake = function() {
		cont.html( '' )
			.addClass( 'profile' );

		SetTitle();

		Loading( true, 'profile' );

		SendRequest(
			{
				method: 'GET',
				action: 'api_call',
				instance: g_cmn.account[cp.param['account_id']].instance,
				api: 'accounts/' + cp.param['id'],
				access_token: g_cmn.account[cp.param['account_id']].access_token
			},
			function( res )
			{
				if ( res.status === undefined )
				{
					profile = res;

					SetTitle();

					// day
					var dt = new Date();
					var cr = DateConv( res.created_at, 0 );
					var compdate = NumFormat( CompareDate( dt.getFullYear(), dt.getMonth() + 1, dt.getDate(),
									cr.substring( 0, 4 ), cr.substring( 5, 7 ), cr.substring( 8, 10 ) ) );

					var myaccount = ( g_cmn.account[cp.param.account_id].id == res.id );
					var display_name_disp = ConvertDisplayName( res.display_name, res.username );
					
					cont.html( OutputTPL( 'profile',
						{
							id: res.id,
							avatar: ImageURLConvert( res.avatar, res.acct, g_cmn.account[cp.param.account_id].instance ),
							display_name: res.display_name,
							username: res.username,
							display_name_disp: display_name_disp,
							instance: GetInstanceFromAcct( res.acct, g_cmn.account[cp.param.account_id].instance ),
							note: res.note,
							day: compdate,
							date: DateConv( res.created_at, 0 ),
							statuses_count: NumFormat( res.statuses_count ),
							following_count: NumFormat( res.following_count ),
							followers_count: NumFormat( res.followers_count ),
							myaccount: myaccount,
						}
					) );
					
					if ( res.header )
					{
						cont.find( '.profilebase' ).css( {
							backgroundImage: 'url("' + ImageURLConvert( res.header, res.acct, g_cmn.account[cp.param.account_id].instance ) + '")',
							backgroundSize: 'cover'
						} );
					}

					cont.find( '.acct .instance' ).on( 'click', function( e ) {
						var _cp = new CPanel( null, null, g_defwidth, g_defheight_l );
						_cp.SetType( 'peeptimeline' );

						_cp.SetParam( {
							timeline_type: 'peep',
							instance: $( this ).attr( 'instance' ),
							reload_time: g_cmn.cmn_param['reload_time'],
							streaming: false,
						} );
						_cp.Start();

						e.stopPropagation();
					} );

					// お気に入り/ミュートしたユーザー/ブロックしたユーザー一覧
					if ( myaccount )
					{
						cont.find( '.special' ).find( '.favourites' ).on( 'click', function( e ) {
							var dupchk = DuplicateCheck( {
								type: 'timeline',
								param: {
									account_id: cp.param.account_id,
									timeline_type: 'favourites',
								}
							} );

							if ( dupchk == -1 )
							{
								var _cp = new CPanel( null, null, g_defwidth, g_defheight_l );
								_cp.SetType( 'timeline' );
								_cp.SetParam( {
									account_id: cp.param.account_id,
									timeline_type: 'favourites',
									reload_time: g_cmn.cmn_param['reload_time'],
									streaming: false,
								} );
								_cp.Start();
							}

							e.stopPropagation();
						} );
					
						cont.find( '.special' ).find( '.muteusers' ).on( 'click', function( e ) {
							var dupchk = DuplicateCheck( {
								type: 'users',
								param: {
									account_id: cp.param.account_id,
									users_type: 'muteusers'
								}
							} );

							if ( dupchk == -1 )
							{
								var _cp = new CPanel( null, null, g_defwidth, g_defheight_l );
								_cp.SetType( 'users' );

								_cp.SetParam( {
									account_id: cp.param.account_id,
									users_type: 'muteusers',
								} );
								_cp.Start();
							}

							e.stopPropagation();
						} );

						cont.find( '.special' ).find( '.blockusers' ).on( 'click', function( e ) {
							var dupchk = DuplicateCheck( {
								type: 'users',
								param: {
									account_id: cp.param.account_id,
									users_type: 'blockusers'
								}
							} );

							if ( dupchk == -1 )
							{
								var _cp = new CPanel( null, null, g_defwidth, g_defheight_l );
								_cp.SetType( 'users' );

								_cp.SetParam( {
									account_id: cp.param.account_id,
									users_type: 'blockusers',
								} );
								_cp.Start();
							}

							e.stopPropagation();
						} );
					}
					// トゥート一覧
					cont.find( '.stats' ).find( '.statuses_count' ).on( 'click', function( e ) {
					OpenUserTimeline( cp.param.account_id, res.id, res.username ,
						res.display_name, GetInstanceFromAcct( res.acct, g_cmn.account[cp.param.account_id].instance ) );

						e.stopPropagation();
					} );

					// フォロー/フォロワー一覧
					cont.find( '.stats' ).find( '.following_count,.followers_count' ).on( 'click', function( e ) {
						var users_type = ( $( this ).hasClass( 'following_count' ) ) ? 'follows' : 'followers';

						var dupchk = DuplicateCheck( {
							type: 'users',
							param: {
								account_id: cp.param.account_id,
								users_type: users_type,
								id: res.id,
								instance: GetInstanceFromAcct( res.acct, g_cmn.account[cp.param.account_id].instance )
							}
						} );

						if ( dupchk == -1 )
						{
							var _cp = new CPanel( null, null, g_defwidth, g_defheight_l );
							_cp.SetType( 'users' );

							var display_name_disp = ConvertDisplayName( res.display_name, res.username );

							_cp.SetParam( {
								account_id: cp.param.account_id,
								users_type: users_type,
								id: res.id,
								instance: GetInstanceFromAcct( res.acct, g_cmn.account[cp.param.account_id].instance ),
								display_name: display_name_disp,
							} );
							_cp.Start();
						}

						e.stopPropagation();
					} );

					Loading( true, 'profile_relationships' );

					SendRequest(
						{
							method: 'GET',
							action: 'api_call',
							instance: g_cmn.account[cp.param['account_id']].instance,
							api: 'accounts/relationships',
							access_token: g_cmn.account[cp.param['account_id']].access_token,
							param: {
								id: cp.param['id']
							},
						},
						function( res )
						{
							if ( res.status === undefined )
							{
								if ( !res[0].followed_by )
								{
									cont.find( '.profilebase' ).find( '.followed_by' ).hide();
								}
								
								cont.find( '.profilebase' ).append( OutputTPL( 'profile_relationships',
									{
										following: res[0].following,
										muting: res[0].muting,
										blocking: res[0].blocking,
									}
								) );
							}
							else
							{
								ApiError( res );
							}

							Loading( false, 'profile_relationships' );
							cont.css( {
								height: cont.find( '.profilebase' ).outerHeight(),
							} );
							
							p.css( {
								height: cont.outerHeight() + p.find( '.titlebar' ).outerHeight() +
										parseInt( p.css( 'border-top-width' ) ) * 2
							} );
							
							// フォロー/解除
							cont.find( '.relationships .follow' ).on( 'click', function( e ) {
								var api = 'accounts/' + cp.param.id + '/';

								if ( $( this ).hasClass( 'on' ) )
								{
									api += 'unfollow';
								}
								else
								{
									api += 'follow';
								}
								
								Loading( true, 'follow' );

								SendRequest(
									{
										method: 'POST',
										action: 'api_call',
										instance: g_cmn.account[cp.param['account_id']].instance,
										api: api,
										access_token: g_cmn.account[cp.param['account_id']].access_token,
									},
									function( res )
									{
										if ( res.status === undefined )
										{
											if ( res.following )
											{
												cont.find( '.relationships .follow' ).addClass( 'on' );
											}
											else
											{
												cont.find( '.relationships .follow' ).removeClass( 'on' );
											}
										}
										else
										{
											ApiError( res );
										}

										Loading( false, 'follow' );
									}
								);
							} );

							// ミュート/解除
							cont.find( '.relationships .mute' ).on( 'click', function( e ) {
								var api = 'accounts/' + cp.param.id + '/';

								if ( $( this ).hasClass( 'on' ) )
								{
									api += 'unmute';
								}
								else
								{
									api += 'mute';
								}
								
								Loading( true, 'mute' );

								SendRequest(
									{
										method: 'POST',
										action: 'api_call',
										instance: g_cmn.account[cp.param['account_id']].instance,
										api: api,
										access_token: g_cmn.account[cp.param['account_id']].access_token,
									},
									function( res )
									{
										if ( res.status === undefined )
										{
											if ( res.muting )
											{
												cont.find( '.relationships .mute' ).addClass( 'on' );
											}
											else
											{
												cont.find( '.relationships .mute' ).removeClass( 'on' );
											}
										}
										else
										{
											ApiError( res );
										}

										Loading( false, 'mute' );
									}
								);
							} );

							// ブロック/解除
							cont.find( '.relationships .block' ).on( 'click', function( e ) {
								var api = 'accounts/' + cp.param.id + '/';

								Loading( true, 'block' );

								var _api_call = function() {
									SendRequest(
										{
											method: 'POST',
											action: 'api_call',
											instance: g_cmn.account[cp.param['account_id']].instance,
											api: api,
											access_token: g_cmn.account[cp.param['account_id']].access_token,
										},
										function( res )
										{
											if ( res.status === undefined )
											{
												if ( res.blocking )
												{
													cont.find( '.relationships .block' ).addClass( 'on' );
												}
												else
												{
													cont.find( '.relationships .block' ).removeClass( 'on' );
												}
											}
											else
											{
												ApiError( res );
											}

											Loading( false, 'block' );
										}
									);
								}

								if ( $( this ).hasClass( 'on' ) )
								{
									api += 'unblock';
									_api_call();
								}
								else
								{
									api += 'block';
									
									if ( confirm( i18nGetMessage( 'i18n_0398' ) ) )
									{
										_api_call();
									}
								}
							} );
						}
					);
				}
				else
				{
					ApiError( res );
				}

				Loading( false, 'profile' );
			}
		);
	};

	////////////////////////////////////////////////////////////
	// 開始処理
	////////////////////////////////////////////////////////////
	this.start = function() {
		////////////////////////////////////////
		// このパネルを開いたアカウントが
		// 削除された場合
		////////////////////////////////////////
		var AccountAliveCheck = function() {
			if ( g_cmn.account[cp.param['account_id']] == undefined )
			{
				// パネルを閉じる
				p.find( '.close' ).trigger( 'click', [false] );
				return false;
			}

			return true;
		};

		////////////////////////////////////////
		// アカウント情報更新
		////////////////////////////////////////
		cont.on( 'account_update', function() {
			if ( AccountAliveCheck() )
			{
				SetTitle();
			}
		} );

		if ( !AccountAliveCheck() )
		{
			return;
		}

		ProfileMake();
	};

	////////////////////////////////////////////////////////////
	// 終了処理
	////////////////////////////////////////////////////////////
	this.stop = function() {
	};
}
