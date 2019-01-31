<h2>Standart form</h2>
<form-builder url="/send/5" disabled-dialog
              :default="{input_set:'Transmitted value', input_disabled_set: 'Disabled value set', check_active: true, switcher_active: true, textarea_set: 'Transmitted text', range_set: 45}">

    <template slot-scope="{ fields }">
        <div class="grid__cell fb_content">
            <h3>General elements</h3>
            <h4>Input example</h4>
        </div>
        <fb-input name="input" label="Label" cell="2"></fb-input>
        <fb-input name="input_set" label="Input is set and focus" focus cell="2"></fb-input>
        <fb-input name="minput" label="Masked input: 3 letters - 3 digits" mask="AAA-###" cell="2"></fb-input>
        <fb-input name="input_disabled" label="Input disabled" disabled cell="2"></fb-input>
        <fb-input name="input_disabled_set" label="Input disabled set" disabled></fb-input>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Checkbox example</h4>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique expedita alias atque amet. Ipsam delectus iure illum voluptatum qui recusandae tenetur odio, ad eaque natus cumque deleniti facilis corporis aliquam?</p>
        </div>
        <fb-checkbox name="check" label="Checkbox"></fb-checkbox>
        <fb-checkbox name="check_active" label="Checkbox active"></fb-checkbox>
        <fb-checkbox name="check_disabled" label="Checkbox disabled" disabled></fb-checkbox>
        <div class="grid__cell fb_content fb_content-mt">
            <h4>Switcher example</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aper</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aper</p>
        </div>
        
        <fb-checkbox name="switcher" label="Switcher" theme="s2"></fb-checkbox>
        <fb-checkbox name="switcher_active" label="Switcher active" theme="s2"></fb-checkbox>
        <fb-checkbox name="switcher_disabled" label="Switcher disabled" disabled theme="s2"></fb-checkbox>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Radio-group example</h4>
        </div>
        <fb-radio-group name="radio" label="radio" :items="[{name:'one', value: 1}, {name:'two', value: 2}, {name:'three', value: 3}]"></fb-radio-group>

        <div class="grid__cell"><div class="v-popover display-block"><span aria-describedby="popover_x2dqybnzl2" tabindex="-1" class="trigger" style="display: inline-block;"><span class="display-block fc-radio"><label class="fc-radio__box"><input type="radio" data-awes="fb-radio-group.type" class="fc-radio__field is-focusable in-focus" value="Company"> <span class="fc-radio__text">Company</span></label><label class="fc-radio__box is-checked"><input type="radio" data-awes="fb-radio-group.type" class="fc-radio__field is-focusable in-focus" value="Freelancer"> <span class="fc-radio__text">Freelancer</span></label></span> <!----></span> </div></div>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Select example</h4>
        </div>

        <fb-select name="select" label="Select" :multiple="false" cell="2"
                   :select-options="[{name:'one', value: 1}, {name:'two', value: 2}]"></fb-select>
        <fb-select name="multi_select" label="Multi-select" cell="2"
                   :select-options="[{name:'one', value: 1}, {name:'two', value: 2}]"></fb-select>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Textarea example</h4>

            <ul>
                <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero nisi accusamus quasi enim pariatur quidem ea impedit aut exercitationem! Hic laborum quos excepturi. Inventore aliquam aperiam soluta non architecto accusamus?</li>
                <li>Impedit nihil officia, perferendis reiciendis aliquid repellat incidunt sit repudiandae ea voluptates quam autem nobis, officiis sed dolorem qui laborum itaque? Reprehenderit culpa assumenda iure harum! Magnam eveniet laborum omnis?</li>
                <li>Cum blanditiis sit a exercitationem consequuntur! Illo sapiente incidunt suscipit nobis veniam ad earum provident! Dolorem ea fugiat voluptatum veniam odio nulla asperiores eum! Qui quibusdam veniam velit commodi eaque.</li>
                <li>Ut in at iure possimus cumque modi repellendus praesentium voluptatem sit ratione consectetur quidem sunt dolores quae eveniet sequi velit consequuntur rem, incidunt earum eos, recusandae nobis? Provident, nam odio?</li>
                <li>Eos sint rerum ipsa repellendus temporibus nostrum nisi animi quos enim blanditiis fuga, doloremque iste sapiente expedita, reiciendis cumque sed eveniet modi, quidem tempora tenetur facilis cupiditate. Laboriosam, esse animi.</li>
            </ul>
        </div>
        <fb-textarea name="textarea" label="Textarea"></fb-textarea>
        <fb-textarea name="textarea_set" label="Textarea set"></fb-textarea>
        <fb-textarea name="textarea_disabled" label="Textarea disabled" disabled></fb-textarea>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Slider</h4>

            <ol>
                <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic voluptatem corporis sequi beatae? Corporis culpa aspernatur, at quaerat, enim veritatis atque molestiae officia repellat totam ab dolorum sapiente earum adipisci.</li>
                <li>Dolores recusandae natus enim facere maxime! Quibusdam culpa magnam atque, consectetur ab consequuntur est tempora fugiat quo expedita minima pariatur officia, assumenda ex molestiae vero a dolor beatae quia unde!</li>
                <li>Nulla quas, facere non, ex dignissimos rem minima, impedit consectetur eum quisquam mollitia incidunt nisi eveniet omnis nam sed laborum nostrum aliquam sequi possimus aliquid a quis perferendis. Voluptatibus, ipsum!</li>
                <li>Voluptatum debitis sint, tempore quasi ab asperiores dolore saepe exercitationem sunt blanditiis at totam modi fuga voluptatem provident atque numquam. Sed dolorum enim, sequi esse iusto quas ducimus cupiditate tempora!</li>
                <li>Quis ut omnis laudantium beatae rem doloribus soluta aperiam officiis excepturi unde? Ex similique, temporibus cupiditate perferendis maxime possimus modi aliquam sequi expedita deserunt repellat beatae neque, atque, perspiciatis officia!</li>
            </ol>

            <blockquote>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem beatae rerum excepturi omnis molestiae dolorum, minus accusamus eaque earum impedit odio provident quisquam quam est eum nostrum quaerat dolore iure!</blockquote>
        </div>
        <fb-slider name="range" label="Range"></fb-slider>
        <fb-slider name="range_set" label="Range set"></fb-slider>
        <fb-slider name="range_disabled" label="Range disabled" disabled></fb-slider>

        <div class="grid__cell fb_content fb_content-mt">
            <h3>Multi-block example</h3>
        </div>

        <fb-multi-block name="multi">
            <template slot-scope="mb">
                <fb-input name="minput" label="Input" :id="mb.id" cell="2"></fb-input>
                <fb-checkbox name="mcheck" label="Checkbox"  cell="2"></fb-checkbox>
                <fb-select name="mselect" label="Select" :multiple="false"  cell="2" 
                           :select-options="[{name:'one', value: 1}, {name:'two', value: 2}]"></fb-select>
                <fb-textarea name="mtextarea" label="Textarea"></fb-textarea>
            </template>
        </fb-multi-block>

        <div class="grid__cell fb_content fb_content-mt">
            <h3>Additional elements</h3>
            <h4>Telephone</h4>
        </div>
        <fb-phone name="phone"></fb-phone>

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Code example</h4>
        </div>
 
        <fb-code name="code"></fb-code>
    

        <div class="grid__cell fb_content fb_content-mt">
            <h4>Company slug example</h4>
        </div>

        <fb-input name="company" label="Company"></fb-input>
        <fb-company-slug name="slug" input="company" label="Company slug"></fb-company-slug>

        <div class="grid__cell fb_content fb_content-mt">
            <h3>Dynamic fields</h3>
        </div>
        <fb-checkbox name="check_dynamic" label="Checkbox dynamic"></fb-checkbox>
        <template v-if="fields.check_dynamic">
            <fb-input name="input_dynamic" label="Input dynamic"></fb-input>
        </template>
    </template>
</form-builder>
<br><br>

<h2>Broken form</h2>
<form-builder url="/broken" disabled-dialog
              :default="{input_set:'Transmitted value', check_active: true, switcher_active: true, textarea_set: 'Transmitted text', range_set: 45}">
    <fb-input name="input" label="Label"></fb-input>
</form-builder>

<br><br>

<h2>Modal form</h2>
<modal-window name="form" title="lorem" class="modal_formbuilder">
    <form-builder url="/send/1">
       
        <fb-input name="input_modal" label="Input modal"></fb-input>
        <fb-select name="select_modal" label="Select modal" :multiple="false"
                   :select-options="[{name:'one', value: 1}, {name:'two', value: 2}]"></fb-select>
        <fb-multi-block name="multi">
            <template slot-scope="mb">
                <fb-input name="minput" label="Input" :id="mb.id"></fb-input>
                <fb-checkbox name="mcheck" label="Checkbox"></fb-checkbox>
                <fb-select name="mselect" label="Select" :multiple="false"
                           :select-options="[{name:'one', value: 1}, {name:'two', value: 2}]"></fb-select>
                <fb-textarea name="mtextarea" label="Textarea"></fb-textarea>
            </template>
        </fb-multi-block>
        <fb-textarea name="textarea_modal" label="Textarea modal"></fb-textarea>
    </form-builder>
</modal-window>
<button @click="AWES.emit('modal::form.open')">Open modal form</button>
