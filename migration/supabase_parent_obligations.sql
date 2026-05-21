-- SQL to set up parent obligations table and seed data
-- Run this in your Supabase SQL Editor

-- Create the table with columns matching the React application fields
CREATE TABLE IF NOT EXISTS parent_obligations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  heading TEXT,
  content TEXT NOT NULL,
  "attachmentUrl" TEXT,
  order_index INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Obligations of Parents
INSERT INTO parent_obligations (id, title, heading, content, order_index, is_enabled)
VALUES (
  'obl_1',
  'OBLIGATIONS OF PARENTS',
  'The greater the co-operation between home and School, the more fruitful will the educational effort be and the faster and surer the child’s progress.',
  '1. As a first step in this direction we earnestly recommend the parents and the guardians, to familiarize themselves with this Diary and the rules it contains.
2. We also recommend that the parents check the Diary of their child regularly and enforce regularity and discipline at home and see that the lessons are prepared and the assigned homework done. Remarks made in the Diary should be seen and countersigned .failure to do so may put the children to great inconvenience.
3. Parents and guardians are requested not to visit their ward or the teacher in the classrooms. Appointments and other requests with the Vice-principals and teachers may be made through the pages of the School Diary. In urgent cases students may be contacted through the school office.
4. Criticism of students teacher or the school in the presence of the child should be avoided as it is likely to harm him/her. Should you have a legitimate complaint, see the principal, by all means.
5. Children who are ill should not be sent to the School to attend class or to take tests.
6. Taking the ward out from classes for mere social functions is not recommended, in the school.
7. Should you feel that your child does not make the desired progress, the principal should be contacted. If there is real need of a private tutor, arrange for one only after getting permission from the principal. No teacher is allowed to tutor the students of a class, he/she teaches.
8. Parents /guardians are requested to notify the school of any change in their address.
9. Parents Should discourage their children from bringing valuable articles to school. The school does not take responsibility for any article or money lost.
10. Arrangement made by the school authorities such as cycle stand, N.C.C. and scout rooms are purely for the convenience of the students. The school will not accept responsibility for any loss or damage incurred when using them.
11. Your co-operation is a must to ensure that no sharp, pointed or other dangerous articles are brought to the school. This applies in a special way to the students of the primary classes.
12. Parents are expected to attend at least two parent-meet-Teacher Sessions in year and sign the register kept with the class teacher. Failure to attend at least two such sessions will force the school authorities to conclude that the parents/guardians are not sufficiently interested in the education of their son/daughter in the school.
13. **PARENTS OF CLASS XII:** Kindly make sure that you ward has given the pre-board examination and clear all the papers with a minimum of 33% in all subjects.',
  1,
  true
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  heading = EXCLUDED.heading,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled;

-- 2. Expectation from Parents / Guardians
INSERT INTO parent_obligations (id, title, heading, content, order_index, is_enabled)
VALUES (
  'obl_2',
  'EXPECTATION FROM PARENTS / GUARDIANS',
  '1. The School Expects That You Will',
  '1. Be available if it is necessary, to discuss aspects of you child s behaviour at school .sign messages, progress reports or other similar documents when requested to do so, to avoid putting your child though any inconvence.
2. Check the school diary daily, as it forms a link between the school and the parents.
3. Ensure that your ward is not absent on the first and last day of the school term without prior permission and that any leave taken from school is duly explained in the diary.',
  2,
  true
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  heading = EXCLUDED.heading,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled;

INSERT INTO parent_obligations (id, title, heading, content, order_index, is_enabled)
VALUES (
  'obl_3',
  'EXPECTATION FROM PARENTS / GUARDIANS',
  '2. The Teaching Staff Expects That You Will',
  '1. Feel free to contact an individual teacher during his/his free periods by taking prior permission from the principal/ coordinator if you wish to discuss a matter of concern to you or your child.
2. Be open to listening and considering the teachers’ opinions regarding your child even when the comments may be less the complimentary.',
  3,
  true
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  heading = EXCLUDED.heading,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled;

INSERT INTO parent_obligations (id, title, heading, content, order_index, is_enabled)
VALUES (
  'obl_4',
  'EXPECTATION FROM PARENTS / GUARDIANS',
  '3. Other Parents Expect That You Will',
  '1. Exert firm parental discipline in cases where your child’s behavior is distracting from the quality of learning opportunities for others in the school.
2. Keep your child at home if he is suffering from chickenpox, small pox whooping cough conjunctivitis and send him to school only with doctors fitness certificate.
3. A tag bearing the name of the pupil should invariably be attached to the school blazer and jersey/pullover.',
  4,
  true
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  heading = EXCLUDED.heading,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled;

-- 3. Recommendations to the Parents
INSERT INTO parent_obligations (id, title, heading, content, order_index, is_enabled)
VALUES (
  'obl_5',
  'RECOMMENDATIONS TO THE PARENTS',
  '',
  '1. Parents are requested to remain regularly in touch with the day to day studies of the child and also keep in contact with the school.
2. Private tuitions are strongly discouraged. It is important that a child develops the habit of working and studying on his own under the guidance of parents.
3. Parents are requested to check the school diary daily and take a note of and also sign the remarks made in diary.
4. Parents must give significant time and attention towards the progress and daily work of the children and help them daily in their studies.
5. Parents should make it a point to attend the Parents teacher’s meeting on given date. The school administration will take a serious view of parents regularly absenting themselves from such meetings.
6. In all official correspondence with the school the full name of the child, registration number, as well as the class and roll number should be stated.
7. Respect for person, property and environment should be should be inculcated in children.
8. Kindly ensure that you child packs his school diary/ book/ note books/ pen/ pencil box as per the time table for school every day to avoid being overloaded.',
  5,
  true
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  heading = EXCLUDED.heading,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled;
