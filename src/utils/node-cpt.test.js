import {
  updateCptValue,
} from './node-cpt';

describe('Node Validations', () => {
  describe('updateCptValue', () => {
    describe('When cpt is a object', () => {
      const cpt = {
        T: 0.5,
        F: 0.5,
      };

      it('updates object value', () => {
        expect(updateCptValue(cpt, 0.8, 'T')).toEqual({
          T: 0.8,
          F: 0.5,
        });
      });
    });

    describe('When cpt is an array', () => {
      const cpt = [
        {
          when: {
            Node_father: 'T',
          },
          then: {
            T: 0.5,
            F: 0.5,
          },
        },
        {
          when: {
            Node_father: 'F',
          },
          then: {
            T: 0.5,
            F: 0.5,
          },
        },
      ];

      it('updates array value', () => {
        expect(updateCptValue(cpt, 0.3, 'F', 1)).toEqual([
          {
            when: {
              Node_father: 'T',
            },
            then: {
              T: 0.5,
              F: 0.5,
            },
          },
          {
            when: {
              Node_father: 'F',
            },
            then: {
              T: 0.5,
              F: 0.3,
            },
          },
        ]);
      });
    });
  });
});
