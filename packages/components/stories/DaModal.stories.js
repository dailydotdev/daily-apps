import { storiesOf } from '@storybook/vue';

import DaModal from '../src/components/DaModal.vue';

storiesOf('DaModal', module)
  .add('default', () => ({
    components: { DaModal },
    template: `
    <div>
      <button class="btn-icon" title="Open modal" @click.prevent="showModal = true">
        <svgicon icon="terminal"/>
      </button>
      <DaModal class="story-modal" v-if="showModal" @close="showModal = false" ref="modal">
        <p class="story-modal__text">
          To improve Daily we use analytics platforms.
          We kindly ask your approval for tracking your activity here.
          We promise to never misuse it.<br/><br/>
          Do you agree to opt-in?
        </p>
        <div class="story-modal__buttons">
          <button class="btn btn-big btn-invert"
                  @click.prevent="$refs.modal.close()">
            Yes, I'd love to
          </button>
          <button class="btn btn-big btn-hollow" @click.prevent="$refs.modal.close()">
            No
          </button>
        </div>
      </DaModal>
    </div>
    `,
    data() {
      return { showModal: false };
    },
  }));

