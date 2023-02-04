"use strict";

////////////////////////////////////////////////////////////////////////////////
// リスト一覧
////////////////////////////////////////////////////////////////////////////////
Contents.lists = function( cp )
{
	var p = $( '#' + cp.id );
	var cont = p.find( 'div.contents' );
	var scrollPos = null;

	cp.SetIcon( 'icon-list' );

	////////////////////////////////////////////////////////////
	// リスト部作成
	////////////////////////////////////////////////////////////
	var ListMake = function() {
		var list_items = new Array();

		cont.find( '.panel_btns' ).find( '.lists_edit' ).addClass( 'disabled' )
			.end()
			.find( '.lists_del' ).addClass( 'disabled' )
			.end()
			.attr( { screen_name: '', slug: '' } );

		var account = g_cmn.account[cp.param['account_id']];

		SendRequest(
			{
				method: 'GET',
				action: 'api_call',
				instance: g_cmn.account[cp.param['account_id']].instance,
				api: 'lists/',
				access_token: g_cmn.account[cp.param['account_id']].access_token
			},
			function( res )
			{
				for ( var i = 0, _len = res.length ; i < _len ; i++ )
				{
					list_items.push( res[i] );
				}


				// リスト情報を最新状態に更新
				account.lists = new Array();

				for ( var i = 0, _len = list_items.length ; i < _len ; i++ )
				{
					account.lists.push( {
						id: list_items[i].id,
						title: list_items[i].title,
						replies_policy: list_items[i].replies_policy,
					} );
				}

				cont.find( '.lists_list' ).html( OutputTPL( 'lists_list', { items: list_items } ) )
					.end()
					.trigger( 'contents_resize' );

				////////////////////////////////////////
				// リスト名クリック処理
				////////////////////////////////////////
				cont.find( '.lists_list' ).find( '.item' ).find( '.fullname' ).find( 'span:first-child' ).click( function( e ) {
					var fullname = $( this ).parent();

					var _cp = new CPanel( null, null, 360, $( window ).height() * 0.75 );
					_cp.SetType( 'timeline' );

					var account = g_cmn.account[cp.param['account_id']];
					var open_acc = ConvertDisplayName( account.display_name, account.username );

					_cp.SetParam( {
						account_id: cp.param['account_id'],
						timeline_type: 'list',
						screen_name: open_acc,
						id: fullname.attr( 'id' ),
						name: fullname.attr( 'title' ),
						reload_time: g_cmn.cmn_param['reload_time'],
						streaming: true,
					} );
					_cp.Start();

					e.stopPropagation();
				} );

				////////////////////////////////////////
				// 表示ボタンクリック処理
				////////////////////////////////////////
				cont.find( '.lists_list' ).find( '.item' ).find( '.show' ).click( function( e ) {
					var fullname = $( this ).parent().parent().find( '.fullname' );

					var _cp = new CPanel( null, null, 360, $( window ).height() * 0.75 );
					_cp.SetType( 'timeline' );

					var account = g_cmn.account[cp.param['account_id']];
					var open_acc = ConvertDisplayName( account.display_name, account.username );

					_cp.SetParam( {
						account_id: cp.param['account_id'],
						timeline_type: 'list',
						screen_name: open_acc,
						id: fullname.attr( 'id' ),
						name: fullname.attr( 'title' ),
						reload_time: g_cmn.cmn_param['reload_time'],
						streaming: true,
					} );
					_cp.Start();

					e.stopPropagation();
				} );

				$( 'panel' ).find( 'div.contents' ).trigger( 'api_remaining_update', [cp.param['account_id']] );
			}
		);
	};

	////////////////////////////////////////////////////////////
	// 開始処理
	////////////////////////////////////////////////////////////
	this.start = function() {
		////////////////////////////////////////
		// 最小化/設定切替時のスクロール位置
		// 保存/復元
		////////////////////////////////////////
		cont.on( 'contents_scrollsave', function( e, type ) {
			// 保存
			if ( type == 0 )
			{
				if ( scrollPos == null )
				{
					scrollPos = cont.find( '.lists_list' ).scrollTop();
				}
			}
			// 復元
			else
			{
				if ( scrollPos != null )
				{
					cont.find( '.lists_list' ).scrollTop( scrollPos );
					scrollPos = null;
				}
			}
		} );

		////////////////////////////////////////
		// リサイズ処理
		////////////////////////////////////////
		cont.on( 'contents_resize', function() {
			cont.find( '.lists_list' ).height( cont.height() - cont.find( '.panel_btns' ).height() - 1 );
		} );

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
			AccountAliveCheck();
		} );

		if ( !AccountAliveCheck() )
		{
			return;
		}

		// 全体を作成
		cont.addClass( 'lists' )
			.html( OutputTPL( 'lists', {} ) );
		var account = g_cmn.account[cp.param['account_id']];
		var open_acc = ConvertDisplayName( account.display_name, account.username );
		cp.SetTitle( open_acc + '@' + account.instance + i18nGetMessage( 'i18n_0167' ), false );

		cont.find( '.list_create' ).hide();

		////////////////////////////////////////
		// 更新ボタンクリック
		////////////////////////////////////////
		cont.find( '.panel_btns' ).find( '.lists_reload' ).click( function( e ) {
			// disabledなら処理しない
			if ( $( this ).hasClass( 'disabled' ) )
			{
				return;
			}

			ListMake();

			e.stopPropagation();
		} );

		// リスト部作成処理
		ListMake();
	};

	////////////////////////////////////////////////////////////
	// 終了処理
	////////////////////////////////////////////////////////////
	this.stop = function() {
	};
}
