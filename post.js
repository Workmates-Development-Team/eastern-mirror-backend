app.get('/add-data', async (req, res) => {

    // try {
    //     await articleModels.findByIdAndDelete("677bc36d4b2221f6d5870841")
    //     res.send('Done')
    // } catch (error) {
    //     console.log(error)
    // }
    try {
        const articleData = {
            _id: new mongoose.Types.ObjectId('677bc3584b2221f6d586f6ff'),
            title: 'How to spend your summer vacation resourcefully',
            content: `<!-- wp:image {"id":553461,"sizeSlug":"full","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-full"><img src="https://api.easternmirrornagaland.com/2024/07/Alobo-Ayemi.jpeg" alt="summer vacation" class="wp-image-553461"/><figcaption class="wp-element-caption"><strong><em>Alobo Ayemi</em></strong></figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Looking forward to spending the summer vacation resourcefully? Here is a guide to a purposeful summer, while making sure to blend personal interests with opportunities for growth and relaxation.&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><!-- wp:list-item -->
<li><em><mark style="background-color:rgba(0, 0, 0, 0);color:#b400ff" class="has-inline-color"><strong>Reading</strong>:</mark></em><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-black-color"> </mark>Reading is one of the oldest tricks in the book to enhance one’s knowledge, improve reading skills and to discover the various kinds of writing format known to mankind. It not sharpens the mind but also helps improve one’s imagination. There are so many self-help books which can help one be their better self, like the saying, “Instead of trying to be better than someone, be the better version of your yesterday self.” </li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol></ol>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Some books like ‘<em>12 Rules for Life’</em> by Jordan Peterson, <em>‘The Courage to Be Disliked’</em> by Ichiro Kishimi and Fumitake Koga, <em>‘To Kill a Mockingbird’ </em>by Harper Lee, and <em>‘Before the Coffee Gets Cold’ </em>by Toshikazu Kawaguchi are an interesting read. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-vivid-purple-color"><em>2. <strong>Learning new skills:</strong></em> </mark>When there are no academic activities required, there are various activities one can indulge to discover their hidden talents and even learn new skills. This can be the opportunity to finally impress your family with your new recipe, or a chance to finally sign up for music classes, improve one’s photography skills, among others.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-vivid-purple-color"><em>3. <strong>Gardening</strong>:</em> </mark>Did you know that gardening not only clears your mind but also contributes to the well-being of your plants and the environment? Being worried about the worms and bugs surely gives you no time to stress over academics. Studies suggest that gardening helps manage blood sugar levels, similar to how exercise and diet can prevent Type 2 diabetes. It is also a great way to soak up vitamin D, but remember to stay hydrated to prevent sunstroke. This can be a fun activity with your siblings, parents or even friends.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-vivid-purple-color"><em>4. <strong>Engaging in conversations and activities with elders:</strong></em> </mark>Why not take this summer vacation as an opportunity to connect with your loved ones? Time is precious and life is fleeting. Instead of dwelling on regrets after it is too late, cherish moments together now. Even during vacations, life's uncertainties continue, reminding us to live purposefully. Families can enjoy simple yet meaningful activities like board games, trips, picnics, and heartfelt conversations. Memories are made not just in special hours or places, but in shared experiences and conversations. Get engaged with elders and learn more about one’s own traditions and folklores. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>In addition to these activities, students can also assist parents with cleaning and organising the home, explore new hobbies—there is a wealth of information available on the internet—learn new languages, and find creative ways to approach school projects and assignments. The possibilities are limitless! Having a fulfilling summer vacation may vary for each person, so use this opportunity to reconnect and discover yourself, because ultimately, you are your own best companion.&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-purple"}}}},"textColor":"vivid-purple"} -->
<p class="has-vivid-purple-color has-text-color has-link-color"><strong><em>Alobo Ayemi</em></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-purple"}}}},"textColor":"vivid-purple"} -->
<p class="has-vivid-purple-color has-text-color has-link-color"><strong><em>3rd Semester</em></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-purple"}}}},"textColor":"vivid-purple"} -->
<p class="has-vivid-purple-color has-text-color has-link-color"><strong><em>Bachelor of Mass Communication</em></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-purple"}}}},"textColor":"vivid-purple"} -->
<p class="has-vivid-purple-color has-text-color has-link-color"><strong><em>Tetso College</em></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-purple"}}}},"textColor":"vivid-purple"} -->
<p class="has-vivid-purple-color has-text-color has-link-color"><strong><em>Sovima, Chümoukedima</em></strong></p>
<!-- /wp:paragraph -->`,
            thumbnail: '/2024/07/Alobo-Ayemi.jpeg',
            category: [new mongoose.Types.ObjectId('66fb916a21086e87bf502030')],
            tags: [
              'Summer Vacation',
              'Alobo Ayemi'
            ],
            isPublished: true,
            author: new mongoose.Types.ObjectId('67764f6e14cb96309dcb3c66'),
            slug: 'how-to-spend-your-summer-vacation-resourcefully',
            publishedAt: new Date('2024-07-16T23:24:20Z'),
            createdAt: new Date('2024-07-16T23:24:20Z'),
            updatedAt: new Date('2025-01-30T06:51:31.984Z'),
            plainTextContent: `Alobo Ayemi



Looking forward to spending the summer vacation resourcefully? Here is a guide to a purposeful summer, while making sure to blend personal interests with opportunities for growth and relaxation. 




Reading: Reading is one of the oldest tricks in the book to enhance one’s knowledge, improve reading skills and to discover the various kinds of writing format known to mankind. It not sharpens the mind but also helps improve one’s imagination. There are so many self-help books which can help one be their better self, like the saying, “Instead of trying to be better than someone, be the better version of your yesterday self.” 












Some books like ‘12 Rules for Life’ by Jordan Peterson, ‘The Courage to Be Disliked’ by Ichiro Kishimi and Fumitake Koga, ‘To Kill a Mockingbird’ by Harper Lee, and ‘Before the Coffee Gets Cold’ by Toshikazu Kawaguchi are an interesting read. 



2. Learning new skills: When there are no academic activities required, there are various activities one can indulge to discover their hidden talents and even learn new skills. This can be the opportunity to finally impress your family with your new recipe, or a chance to finally sign up for music classes, improve one’s photography skills, among others.



3. Gardening: Did you know that gardening not only clears your mind but also contributes to the well-being of your plants and the environment? Being worried about the worms and bugs surely gives you no time to stress over academics. Studies suggest that gardening helps manage blood sugar levels, similar to how exercise and diet can prevent Type 2 diabetes. It is also a great way to soak up vitamin D, but remember to stay hydrated to prevent sunstroke. This can be a fun activity with your siblings, parents or even friends.



4. Engaging in conversations and activities with elders: Why not take this summer vacation as an opportunity to connect with your loved ones? Time is precious and life is fleeting. Instead of dwelling on regrets after it is too late, cherish moments together now. Even during vacations, life's uncertainties continue, reminding us to live purposefully. Families can enjoy simple yet meaningful activities like board games, trips, picnics, and heartfelt conversations. Memories are made not just in special hours or places, but in shared experiences and conversations. Get engaged with elders and learn more about one’s own traditions and folklores. 



In addition to these activities, students can also assist parents with cleaning and organising the home, explore new hobbies—there is a wealth of information available on the internet—learn new languages, and find creative ways to approach school projects and assignments. The possibilities are limitless! Having a fulfilling summer vacation may vary for each person, so use this opportunity to reconnect and discover yourself, because ultimately, you are your own best companion. 



Alobo Ayemi



3rd Semester



Bachelor of Mass Communication



Tetso College



Sovima, Chümoukedima`,
          };
      
          // Insert into MongoDB
          const newArticle = new articleModels(articleData);
          await newArticle.save();
          res.send('Done')

    } catch (error) {
        console.log(error)
    }
})