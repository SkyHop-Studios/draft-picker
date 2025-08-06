import {subscriptionBuilder} from '/imports/rpc/subscription-builder'
import {registerPublications} from '/imports/rpc/register-publications'
import {DraftProgressCollection} from '/imports/core/infrastructure/db/draft-progress'

const _publications = {
  "draft.progress": subscriptionBuilder({
    run(_context) {
      return DraftProgressCollection.find();
    }
  })
};

export type DraftPublications = typeof _publications;
registerPublications(_publications);
