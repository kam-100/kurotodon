<div class='item' id='{$id}' instance='{$instance}' display_name='{$display_name}' avatar='{$avatar}' username='{$username}' status_id='{$status_id}' created_at='{$created_at}' visibility='{$visibility}'>
	<div class='avatar'>
		{if $notification->type=='favourite'}
			<span class='icon-star'><span>
		{elseif $notification->type=='reblog'}
			<span class='icon-loop'><span>
		{else}
			{if $following!='-'}<img class='tooltip' src='{$avatar}' tooltip='(i18n_0367):{$statuses_count} (i18n_0125):{$following} (i18n_0122):{$followers}'>{else}<img src='{$avatar}'>{/if}
			{if $bt_flg}
				<div class='boost tooltip' tooltip='(i18n_0001)' bt_id='{$bt_id}' bt_instance='{$bt_instance}' bt_display_name='{$bt_display_name}' bt_username='{$bt_username}'>
				<img src='{$bt_avatar}' class='bt_avatar'>
				</div>
			{/if}
			{if $visibility=='unlisted'}<span class='icon-unlocked'></span>{/if}
			{if $visibility=='private'}<span class='icon-lock'></span>{/if}
			{if $visibility=='direct'}<span class='icon-envelope'></span>{/if}
		{/if}
	</div>
	<div class='toot'>
		{if $notification->type=='favourite'||$notification->type=='reblog'}
			<div class='notification' id='{$notification->id}' username='{$notification->username}' display_name='{$notification->display_name}' instance='{$notification->instance}'>
				{if $notification->type=='favourite'}<span class='display_name'>{$notification->display_name_disp}</span>(i18n_0373){/if}
				{if $notification->type=='reblog'}<span class='display_name'>{$notification->display_name_disp}</span>(i18n_0374){/if}
			</div>
		{else}
			<div class='headcontainer'>
				<div class='namedate'>
					<span class='display_name'>{$display_name_disp}</span> <span class='username'>@{$acct}</span>

					<br>
					<span class='date tooltip' tooltip='{$date}'><a href='{$url}' rel="nofollow noopener noreferrer" target='_blank' class='anchor status_url'>{$dispdate}</a></span>
					<span>{if $application->website}<a href='{$application->website}' rel="nofollow noopener noreferrer" target='_blank' class='anchor'>{$application->name}</a>{else}<span class='source'>{$application->name}</span>{/if}</span>
					<br>

					{if $btcnt > 0 || $favcnt > 0}
						<span class='btfav_cnt'>{if $btcnt > 0}<span class='icon-loop'></span>:{$btcnt}{/if} {if $favcnt > 0}<span class='icon-star'></span>:{$favcnt}{/if}</span>
					{/if}
				</div>

				<div class='options' mytoot='{$mytoot}' reblogged='{$reblogged}'>
					<span class='fav tooltip icon-star {if $favourited}on{else}off{/if}' tooltip='(i18n_0054)'></span>
					<span class='btn expandstatus tooltip' tooltip='(i18n_0404)'></span>
				</div>
			</div>
		{/if}
		{if $spoiler_text}<div class='spoiler_text'>{$spoiler_text} <span class='showmore_button'>(i18n_0368)</span></div>{/if}

		<div class='toot_text {if $spoiler_text}off{/if} {if $notification->type=='favourite'||$notification->type=='reblog'}notification{/if}'>{$text}</div>
	</div>
</div>
